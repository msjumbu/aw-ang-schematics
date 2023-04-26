import * as ts from "typescript";
import { SoapPrimitive, Element, IMessage, IDefinition } from './IWSDL';

export class TypesGenerator {

  constructor() { }
  private nodeArrMap = new Map();
  private dataTypes: Record<SoapPrimitive, string> = {
    "xs:boolean": "boolean | null",
    "xs:double": "number | null",
    "xs:float": "number | null",
    "xs:int": "number | null",
    "xs:string": "string | null",
    "xs:short": "number | null",
    "xs:dateTime": "Date | null",
    '': 'string | null',
    'xs:signedInt': 'number | null',
    'xs:unsignedInt': 'number | null',
    'xs:unsignedShort': 'number | null',
    'xs:complexType': '',
    'xsd:boolean': 'boolean | null',
    'xsd:double': 'number | null',
    'xsd:float': 'number | null',
    'xsd:int': 'number | null',
    'xsd:short': 'number | null',
    'xsd:signedInt': 'number | null',
    'xsd:string': 'string | null',
    'xsd:unsignedInt': 'number | null',
    'xsd:unsignedShort': 'number | null',
    'xsd:dateTime': 'Date | null',
    'xsd:complexType': '',
    'xsd:anyType': 'string | null',
    'xsd:date': 'Date | null'
  };

  // Convert from SOAP primitive type to a Typescript type reference, defaulting to String
  private typeFromSOAP(soapType: SoapPrimitive): ts.TypeReferenceNode {
    const typeName = this.dataTypes[soapType] ?? "string | null";
    return ts.factory.createTypeReferenceNode(typeName, []);
  }

  // used for adding `export` directive to generated type
  private exportModifier() {
    return ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Export);
  }

  generateTypes(definition: IDefinition): string {
    definition.messages.forEach(message => {
      this.generateTypesForMessage(message);
    });
    const sourceFile = ts.createSourceFile(
      "soap-types.ts", // the output file name
      "", // the text of the source code, not needed for our purposes
      ts.ScriptTarget.Latest, // the target language version for the output file
      false,
      ts.ScriptKind.TS // output script kind. options include JS, TS, JSX, TSX and others
    );

    const nodeArr = ts.factory.createNodeArray(Array.from(this.nodeArrMap.values()));
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const result = printer.printList(ts.ListFormat.MultiLine, nodeArr, sourceFile);

    let m = [];
    for (let index = 0; index < definition.messages.length; index++) {
      const msg = definition.messages[index];
      for (let i = 0; i < msg.element.length; i++) {
        const element = msg.element[i];
        m.push(element);
      }
    }
    let exportMetaData = `
` + 'export const metadata = ' + JSON.stringify(m, undefined, 2) + `;
`;

    return result + exportMetaData;

  }

  private generateTypesForMessage(message: IMessage) {
    if (message.element && message.element[0]) {
      this.generateMembers(message.element[0], '');
    }
    // the below is to cover messages without any parameters/elements
    if (!this.nodeArrMap.has('I' + message.name)) {   
      if (message.element && message.element[0] && !this.nodeArrMap.has('I' + message.element[0].name)) {
        console.log(message.element[0].name + " : " + this.nodeArrMap.has('I' + message.element[0].name));
        const element = this.createInterface(message.element[0].name, []);
        this.nodeArrMap.set('I' + message.element[0].name, element);
        let t = this.createPropertySignatureWithType(message.element[0].name, ts.factory.createTypeReferenceNode('I' + message.element[0]?.name + ''), false);
        const messageType = this.createInterface(message.name, [t]);
        this.nodeArrMap.set('I' + message.name, messageType);
      } else {
        const messageType = this.createInterface(message.name, []);
        this.nodeArrMap.set('I' + message.name, messageType);
      }
    }
  }

  private generateMembers(element: Element, _dataType: string): ts.TypeElement {
    let interfaceMembers: any[] = new Array();

    if (element.attributes) {
      const assignments: ts.PropertySignature[] = [];
      element.attributes.forEach(attr => {
        const propSign = this.createPropertySignatureWithType(attr.name, this.typeFromSOAP(''), false);
        assignments.push(propSign);
      });
      let t = this.createPropertySignatureWithMembers('meta', assignments, false);
      interfaceMembers.push(t);
      if (!element.element) {
        // it is a node with attributes like <Role application='' organization=''>Developer</Role>, in this case it will genrate the following code
        // export interface Role {
        //   meta: {
        //       application: "",
        //       organization: ""
        //   }
        //   _?: string;
        // }
        const propSign = this.createPropertySignatureWithType('_', this.typeFromSOAP(''), false);
        interfaceMembers.push(propSign);
      }
    }
    if (element.element) {
      element.element.forEach(child => {
        let props = this.generateMembers(child, element.eType);
        interfaceMembers.push(props);
      });
    }
    if ((element.attributes || element.element)) {
      // let required = false;
      let isArray = false;
      if (Number(element.minOccurs ?? 0) >= 1) {
        // required = true;
      }
      if (element.maxOccurs == 'unbounded' || (Number(element.maxOccurs ?? 0) > 1)) {
        isArray = true;
      }
      if ((element.name != 'tuple' && element.name != 'new' && element.name != 'old') || true) {
        if (!this.nodeArrMap.has(element.name)) {
          if (!element.attributes) {
            const propSign = this.createPropertySignatureWithType('meta', ts.factory.createTypeReferenceNode('any'), true);
            interfaceMembers.push(propSign);
          }
          const messageType = this.createInterface(element.name, interfaceMembers);
          this.nodeArrMap.set('I' + element.name, messageType);
        }
        return this.createPropertySignatureWithType(element.name, ts.factory.createTypeReferenceNode('I' + element?.name + ''), isArray);
      } else {
        return this.createPropertySignatureWithMembers(element.name, interfaceMembers, isArray);
      }
    } else {
      let isArray = false;
      if (Number(element.minOccurs ?? 0) >= 1) {
      }
      if (element.maxOccurs == 'unbounded' || (Number(element.maxOccurs ?? 0) > 1)) {
        isArray = true;
      }
      return this.createPropertySignatureWithType(element.name, this.typeFromSOAP(element.eType ?? ''), isArray);
    }
  }

  createInterface(name: string, members: any[]): ts.InterfaceDeclaration {
    const interfaceSymbol = ts.factory.createIdentifier('I' + name);
    const messageType = ts.factory.createInterfaceDeclaration(
      undefined, // no decorators
      this.exportModifier(), // modifiers
      interfaceSymbol, // interface name
      undefined, // no generic type parameters
      undefined, // no heritage clauses (extends, implements)
      members // interface attributes
    );
    return messageType;
  }

  createPropertySignatureWithType(name: string, eType: ts.TypeReferenceNode, isArray: boolean): ts.PropertySignature {
    if (!isArray) {
      const commentProp = ts.factory.createPropertySignature(
        undefined,
        name,
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        eType
      );
      return commentProp;
    } else {
      const commentProp = ts.factory.createPropertySignature(
        undefined,
        name,
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createArrayTypeNode(eType)
      );
      return commentProp;
    }
  }

  createPropertySignatureWithMembers(name: string, members: any[], isArray: boolean): ts.PropertySignature {
    if (!isArray) {
      let t = ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(name),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createTypeLiteralNode(members));
      return t;
    } else {
      let t = ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(name),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createArrayTypeNode(ts.factory.createTypeLiteralNode(members)));
      return t;
    }
  }
}
