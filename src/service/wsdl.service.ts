
import { Parser } from 'xml2js';
import { IDefinition, INamespace, IPortType, IMessage, IOperation, Element, Attribute, xsdTypes } from './IWSDL';
import axios from 'axios';

export class WsdlService {

  constructor() { }
  private xmlParser = new Parser({
    attrkey: "meta", // instructs the parser to pack XML node attributes into a sub-object titled "meta"
  });


  parseXml(xml: string) {
    return new Promise((resolve, reject) => {
      this.xmlParser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async getWSDL(url: string): Promise<IDefinition> {
    console.log("Downloading WSDL ........." + url);
    let wsdl = await axios.get(url, { responseType: 'text' })
    console.log('WSDL Downloaded.');
    let result: any = await this.parseXml(wsdl.data);

    let name = result['wsdl:definitions']['meta']['name'] ?? '';
    let definition: IDefinition = {
      wsdlURL: url,
      name: name,
      services: new Array(),
      bindings: new Array(),
      portTypes: new Array(),
      messages: new Array(),
      elements: new Array(),
      ns: new Array()
    }
    this.setNamespaces(result, definition);

    let wsdlTypes = result['wsdl:definitions']['wsdl:types'];
    if (wsdlTypes) {
      for (let index = 0; index < wsdlTypes.length; index++) {
        const wsdlType = wsdlTypes[index];
        let schemas = wsdlType['schema'] ?? wsdlType['xsd:schema'];
        if (schemas) {
          this.parseSchema(schemas, definition);
        }
      }
    }
    let messages = result['wsdl:definitions']['wsdl:message']
    if (messages) {
      definition.messages = new Array();
      for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        definition.messages.push(this.getMessage(message, definition));
      }
    }
    let portTypes = result['wsdl:definitions']['wsdl:portType'];
    if (portTypes) {
      definition.portTypes = new Array();
      for (let index = 0; index < portTypes.length; index++) {
        const portType = portTypes[index];

        let pt: IPortType = {
          name: portType['meta']['name'],
          operation: undefined,
          ns: undefined
        }

        let operations = portType['wsdl:operation'];
        if (operations) {
          for (let index = 0; index < operations.length; index++) {
            const operation = operations[index];

            let input = operation['wsdl:input'];
            let output = operation['wsdl:output'];
            let tnsName = input[0]['meta']['message'] ?? '';
            let name = tnsName.indexOf(':') >= 0 ? tnsName.split(':')[1] : '';
            let prefix = tnsName.indexOf(':') >= 0 ? tnsName.split(':')[0] : '';
            let elemTns = definition.ns.find(element => element.prefix == prefix);
            let inMsg: IMessage | undefined = definition.messages.find(element => (element.ns?.ns == elemTns?.ns && element.name == name));

            tnsName = output[0]['meta']['message'];
            name = tnsName.indexOf(':') >= 0 ? tnsName.split(':')[1] : '';
            let outMsg: IMessage | undefined = definition.messages.find(element => (element.ns?.ns == elemTns?.ns && element.name == name));

            let op: IOperation = {
              name: operation['meta']['name'],
              input: inMsg,
              output: outMsg,
              ns: elemTns
            }
            pt.operation = op;
            pt.ns = elemTns;
            break;
          }
        }
        definition.portTypes.push(pt);
      }
    }
    return definition;
    // return observable;
  }

  private setNamespaces(result: any, definition: IDefinition) {
    let namespaces = result['wsdl:definitions']['meta'];
    if (namespaces) {
      for (const [key, value] of Object.entries(namespaces)) {
        let prefix = key.indexOf('xmlns') >= 0 ? key.split(':')[1] : '';
        if (!prefix)
          prefix = key == 'targetNamespace' ? key : '';

        let v = value ? value + '' : '';
        if (prefix) {
          let ns: INamespace = {
            prefix: prefix,
            ns: v
          };
          definition.ns.push(ns);
        }
      }
    }
    definition.ns.push({ prefix: 'cordys', ns: 'http://schemas.cordys.com/General/1.0/' });
  }

  parseSchema(schemas: any, definition: IDefinition): boolean {
    //Pass 1 : get all complex types
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];
      let tns = schema['meta']['targetNamespace'] ?? '';
      if (tns == 'http://schemas.cordys.com/General/1.0/') continue;
      // tns = tns.indexOf(':') > 0 ? tns.split(':')[1] : tns;
      let complexTypes = schema['complexType'] ?? schema['xsd:complexType'];
      if (complexTypes) {
        for (let index = 0; index < complexTypes.length; index++) {
          const element = complexTypes[index];
          definition.elements.push(this.getComplexTypes(element, tns, undefined, definition));
        }
      }
    }

    //Pass 2 : get all simple types
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];
      let tns = schema['meta']['targetNamespace'] ?? '';
      if (tns == 'http://schemas.cordys.com/General/1.0/') continue;
      let simpleTypes = schema['simpleType'] ?? schema['xsd:simpleType'];
      if (simpleTypes) {
        for (let index = 0; index < simpleTypes.length; index++) {
          const element = simpleTypes[index];
          definition.elements.push(this.getSimpleTypes(element, tns));
        }
      }
    }

    //Pass 3 : get all elements
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];
      let tns = schema['meta']['targetNamespace'] ?? '';
      if (tns == 'http://schemas.cordys.com/General/1.0/') continue;
      let elements = schema['element'] ?? schema['xsd:element'];
      if (elements) {
        for (let index = 0; index < elements.length; index++) {
          const element = elements[index];
          definition.elements.push(this.getElement(element, tns, definition));
        }
      }
    }

    //Pass 4 : denormalize the xsd
    definition.elements.forEach(element => {
      this.setType(element, definition);
    });
    return false;
  }

  setType(element: Element, definition: IDefinition) {
    if (!(element.eType in xsdTypes)) {
      let elementType = this.findType(element, definition);
      if (!element.element) {
        if (elementType) {
          if (elementType.attributes) {
            if (!element.attributes) element.attributes = new Array();
            element.attributes.push(...elementType.attributes);
          }
          if (elementType.element) {
            element.element = new Array();
            element.element.push(...elementType.element);
          }
          if (elementType.eType in xsdTypes) {
            element.eType = elementType.eType;
          }
        }
      } else {
        element.element.forEach(e => {
          this.setType(e, definition);
        });
      }
    }
  }

  findType(element: Element, definition: IDefinition): Element | undefined {
    let elem = definition.elements.find(e => (e.name == element.eType && e.eType != element.eType));
    if (elem) {
      // if the found element has attributes or child elements or a primitive element, 
      // that means we have reached end of the type reference chain, now we have reached the actual element
      if (elem.attributes || elem.element || elem.eType in xsdTypes)
        return elem;
      else
        return this.findType(elem, definition);
    } else {
      return undefined;
    }
  }

  getMessage(message: any, definition: IDefinition) {
    let msg: IMessage = {
      name: message['meta']['name'],
      element: new Array(),
      ns: undefined
    }

    let parts = message['wsdl:part'];
    if (parts) {
      msg.element = new Array();
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let elemName = part['meta']['element']
        if (elemName) {
          let tnsPrefix = elemName.indexOf(':') > 0 ? elemName.split(':')[0] : '';
          let elemTns = definition.ns.find(element => element.prefix == tnsPrefix);
          if (!elemTns) throw new Error("Invalid wsdl definition");

          let e = elemName.indexOf(':') > 0 ? elemName.split(':')[1] : elemName;
          let eIndex = definition.elements.find(element => (element.tns == elemTns?.ns && element.name == e));
          if (eIndex) {
            msg.element.push(eIndex);
            msg.ns = elemTns;
          }
        }
      }
    }
    return msg;
  }

  getSimpleTypes(sType: any, tns: string): Element {
    let name = sType['meta']?.['name'] ?? '';
    let wElement: Element = new Element();
    wElement.name = name;
    let restrictions = sType['restriction'] ?? sType['xsd:restriction'];
    if (restrictions) {
      for (let index = 0; index < restrictions.length; index++) {
        const restriction = restrictions[index];
        let eType = restriction['meta']['base'];
        wElement.eType = eType;
        wElement.tns = tns;
      }
    }
    return wElement;
  }

  getComplexTypes(cType: any, tns: string, element: Element | undefined, definition: IDefinition): Element {
    let name = cType['meta']?.['name'] ?? '';
    let wElement: Element = new Element();
    if (name) {
      wElement.name = name;
      wElement.tns = tns;
    } else if (element) {
      wElement = element;
    } else {
      throw new Error("Unknown error");
    }

    //Set type from complex content
    let complexContents = cType['complexContent'] ?? cType['xsd:complexContent'];
    if (complexContents) {
      for (let index = 0; index < complexContents.length; index++) {
        const sc = complexContents[index];
        let extensions = sc['extension'] ?? sc['xsd:extension'];
        if (extensions) {
          for (let index = 0; index < extensions.length; index++) {
            const ext = extensions[index];
            if (ext) {
              let eType = ext['meta']?.['base'];
              if (eType)
                wElement.eType = eType.indexOf(':') >= 0 ? eType.split(':')[1] : eType;
            }
          }
        }
      }
    } else { //Otherwise set type from simple content
      let simpleContents = cType['simpleContent'] ?? cType['xsd:simpleContent'];
      if (simpleContents) {
        for (let index = 0; index < simpleContents.length; index++) {
          const sc = simpleContents[index];
          let extensions = sc['extension'] ?? sc['xsd:extension'];
          if (extensions) {
            for (let index = 0; index < extensions.length; index++) {
              const ext = extensions[index];
              if (ext) {
                let eType = ext['meta']?.['base'];
                if (eType)
                  wElement.eType = eType.indexOf(':') >= 0 ? eType.split(':')[1] : eType;
              }
            }
          }
        }
      }
    }

    let attributes = cType['attribute'] ?? cType['xsd:attribute']
    if (!attributes) {
      let simpleContents = cType['simpleContent'] ?? cType['xsd:simpleContent'];
      if (simpleContents) {
        for (let index = 0; index < simpleContents.length; index++) {
          const sc = simpleContents[index];
          let extensions = sc['extension'] ?? sc['xsd:extension'];
          if (extensions) {
            for (let index = 0; index < extensions.length; index++) {
              const ext = extensions[index];
              if (ext) {
                let attrs = ext['attribute'] ?? ext['xsd:attribute'];
                if (attrs) {
                  attributes = new Array();
                  attributes.push(...attrs);
                }
              }
            }
          }
        }
      }
    }
    if (attributes) {
      wElement.attributes = new Array();
      for (let index = 0; index < attributes.length; index++) {
        const attribute = attributes[index];
        let attr = new Attribute();
        attr.name = attribute['meta']['name'];
        attr.eType = attribute['meta']['type'];
        wElement.attributes.push(attr);
      }
    }
    let sequences = cType['sequence'] ?? cType['xsd:sequence'];
    if (sequences) {
      for (let index = 0; index < sequences.length; index++) {
        const sequence = sequences[index];
        let elements = sequence['element'] ?? sequence['xsd:element'];
        if (elements) {
          wElement.element = new Array();
          for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            wElement.element.push(this.getElement(element, tns, definition));
          }
        }
      }
    }
    return wElement;
  }

  getElement(element: any, tns: any, definition: IDefinition): Element {
    let name = element['meta']['name'] ?? '';
    let eType = element['meta']['type'];
    if (!name) {
      name = element['meta']['ref'];
      name = name.indexOf(':') > 0 ? name.split(':')[1] : name;
      eType = name;
    }
    if (eType)
      eType = eType.indexOf(':') > 0 ? eType.split(':')[1] : eType;
    //since new is a keyword, adding _ in the start. for consistancy sake old also treated same
    // name = (name == 'old' || name == 'new') ? '_' + name : name;

    let wElement: Element = new Element();
    wElement.name = name;
    wElement.tns = tns;
    wElement.eType = eType;
    wElement.minOccurs = element['meta']['minOccurs'];
    wElement.maxOccurs = element['meta']['maxOccurs'];
    let complexTypes = element['complexType'] ?? element['xsd:complexType'];
    if (complexTypes) {
      for (let index = 0; index < complexTypes.length; index++) {
        const complexType = complexTypes[index];
        let e = this.getComplexTypes(complexType, tns, wElement, definition);
        if (e.name != wElement.name) {
          if (!wElement.element)
            wElement.element = new Array();
          wElement.element.push(e);
        }
        else
          wElement = e;
      }
    }
    return wElement;
  }
}

