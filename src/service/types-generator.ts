import * as ts from "typescript";
import { SoapPrimitive, Element, IMessage, IDefinition } from './IWSDL';

export class TypesGenerator {

  constructor() { }
  private nodeArrMap = new Map();
  private dataTypes: Record<SoapPrimitive, string> = {
    "xs:boolean": "Boolean",
    "xs:double": "Number",
    "xs:float": "Number",
    "xs:int": "Number",
    "xs:string": "string",
    "xs:short": "Number",
    "xs:dateTime": "Date",
    '': 'string',
    'xs:signedInt': 'Number',
    'xs:unsignedInt': 'Number',
    'xs:unsignedShort': 'Number',
    'xs:complexType': '',
    'xsd:boolean': 'Boolean',
    'xsd:double': 'Number',
    'xsd:float': 'Number',
    'xsd:int': 'Number',
    'xsd:short': 'Number',
    'xsd:signedInt': 'Number',
    'xsd:string': 'string',
    'xsd:unsignedInt': 'Number',
    'xsd:unsignedShort': 'Number',
    'xsd:dateTime': 'Date',
    'xsd:complexType': '',
    'xsd:anyType': 'string',
    'xsd:date': 'Date'
  };

  // Convert from SOAP primitive type to a Typescript type reference, defaulting to String
  private typeFromSOAP(soapType: SoapPrimitive): ts.TypeReferenceNode {
    const typeName = this.dataTypes[soapType] ?? "string";
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
    
    return result;
  }

  private generateTypesForMessage(message: IMessage) {
    if (message.element && message.element[0]) {
      this.generateMembers(message.element[0], '');
    }
    // the below is cover messages without any parameters/elements
    if (!this.nodeArrMap.has(message.name)) {
      const messageType = this.createInterface(message.name, []);
      this.nodeArrMap.set('I' + message.name, messageType);
      const classDeclaration = this.createClass(message.name, 'I' + message.name, []);
      this.nodeArrMap.set(message.name, classDeclaration);
    }
  }

  private generateMembers(element: Element, _dataType: string): [ts.TypeElement, ts.PropertyDeclaration] {
    let interfaceMembers: any[] = new Array();
    let classMembers: any[] = new Array();

    if (element.attributes) {
      const assignments: ts.PropertySignature[] = [];
      const classAssignments: ts.PropertyDeclaration[] = [];
      element.attributes.forEach(attr => {
        const propSign = this.createPropertySignatureWithType(attr.name, this.typeFromSOAP(''), false);
        assignments.push(propSign);
        const propDec = this.createPropertyDeclarationWithType(attr.name, this.typeFromSOAP(''), false);
        classAssignments.push(propDec);
      });
      let t = this.createPropertySignatureWithMembers('meta', assignments, false);
      interfaceMembers.push(t);
      let c = this.createPropertyDeclarationWithMembers('meta', classAssignments, false);
      classMembers.push(c);
      if (!element.element) {
        // it is a node with attributes like <Role application='' organization=''>Developer</Role>, in this case it will genrate the following code
        // export interface Role {
        //   meta: {
        //       application: "",
        //       organization: ""
        //   }
        //   text?: string;
        // }
        const propSign = this.createPropertySignatureWithType('text', this.typeFromSOAP(''), false);
        interfaceMembers.push(propSign);
        const propDec = this.createPropertyDeclarationWithType('text', this.typeFromSOAP(''), false);
        classAssignments.push(propDec);
      }
    }
    if (element.element) {
      element.element.forEach(child => {
        let props = this.generateMembers(child, element.eType);
        interfaceMembers.push(props[0]);
        classMembers.push(props[1]);
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
      if (element.name != 'tuple' && element.name != 'new' && element.name != 'old') {
        if (!this.nodeArrMap.has(element.name)) {
          const messageType = this.createInterface(element.name, interfaceMembers);
          this.nodeArrMap.set('I' + element.name, messageType);
          const classDeclaration = this.createClass(element.name, 'I' + element.name, classMembers);
          this.nodeArrMap.set(element.name, classDeclaration);
        }
        return [this.createPropertySignatureWithType(element.name, ts.factory.createTypeReferenceNode('I' + element?.name + ''), isArray),
        this.createPropertyDeclarationWithType(element.name, ts.factory.createTypeReferenceNode(element?.name + ''), isArray)];
      } else {
        return [this.createPropertySignatureWithMembers(element.name, interfaceMembers, isArray),
        this.createPropertyDeclarationWithMembers(element.name, classMembers, isArray)]
      }
    } else {
      let isArray = false;
      if (Number(element.minOccurs ?? 0) >= 1) {
      }
      if (element.maxOccurs == 'unbounded' || (Number(element.maxOccurs ?? 0) > 1)) {
        isArray = true;
      }
      return [this.createPropertySignatureWithType(element.name, this.typeFromSOAP(element.eType), isArray),
      this.createPropertyDeclarationWithType(element.name, this.typeFromSOAP(element.eType), isArray)]
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

  createClass(name: string, interfaceName: string, members: any[]): ts.ClassDeclaration {
    const interfaceSymbol = ts.factory.createIdentifier(name);
    const classDeclaration = ts.factory.createClassDeclaration(undefined,
      this.exportModifier(),
      interfaceSymbol,
      undefined,
      [ts.factory.createHeritageClause(ts.SyntaxKind.ImplementsKeyword,
        [ts.factory.createExpressionWithTypeArguments(
          ts.factory.createIdentifier(interfaceName),
          undefined
        )]
      )],
      members);
    return classDeclaration;
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

  createPropertyDeclarationWithType(name: string, eType: ts.TypeReferenceNode, isArray: boolean): ts.PropertyDeclaration {
    if (!isArray) {
      const commentProp = ts.factory.createPropertyDeclaration(
        undefined,
        undefined,
        name,
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        eType,
        undefined
      );
      
      return commentProp;
    } else {
      const commentProp = ts.factory.createPropertyDeclaration(
        undefined,
        undefined,
        name,
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createArrayTypeNode(eType),
        undefined
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

  createPropertyDeclarationWithMembers(name: string, members: any[], isArray: boolean): ts.PropertyDeclaration {
    if (!isArray) {
      let t = ts.factory.createPropertyDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier(name),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createTypeLiteralNode(members),
        undefined);
      return t;
    } else {
      let t = ts.factory.createPropertyDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier(name),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createArrayTypeNode(ts.factory.createTypeLiteralNode(members)),
        undefined);
      return t;
    }
  }


}
