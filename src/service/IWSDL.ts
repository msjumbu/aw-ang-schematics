// Primitive datatypes defined by SOAP (there are more)
export type SoapPrimitive = "xs:boolean" |
  "xs:double" |
  "xs:float" |
  "xs:int" |
  "xs:short" |
  "xs:signedInt" |
  "xs:string" |
  "xs:unsignedInt" |
  "xs:unsignedShort" |
  "xs:dateTime" |
  "" |
  "xs:complexType" |
  "xsd:boolean" |
  "xsd:double" |
  "xsd:float" |
  "xsd:int" |
  "xsd:short" |
  "xsd:signedInt" |
  "xsd:string" |
  "xsd:unsignedInt" |
  "xsd:unsignedShort" |
  "xsd:dateTime" |
  "xsd:date" |
  "" |
  "xsd:complexType" |
  "xsd:anyType";

export enum xsdTypes {
  "xs:boolean" ,
  "xs:double" ,
  "xs:float" ,
  "xs:int" ,
  "xs:short" ,
  "xs:signedInt" ,
  "xs:string" ,
  "xs:unsignedInt" ,
  "xs:unsignedShort" ,
  "xs:dateTime" ,
  "xsd:boolean" ,
  "xsd:double" ,
  "xsd:float" ,
  "xsd:int" ,
  "xsd:short" ,
  "xsd:signedInt" ,
  "xsd:string" ,
  "xsd:unsignedInt" ,
  "xsd:unsignedShort" ,
  "xsd:dateTime" ,
  "xsd:date" ,
  "xsd:anyType"
}
export class Attribute {
  name: string = '';
  eType: SoapPrimitive = '';
}
export class Element {
  name: string = '';
  eType: SoapPrimitive = '';
  element: Element[] | undefined;
  attributes: Attribute[] | undefined;
  tns: string = '';
  minOccurs?: string;
  maxOccurs?: string;
}
export interface IMessage {
  name: string;
  element: Element[];
  ns: INamespace | undefined;
}
export interface IOperation {
  name: string;
  input?: IMessage | undefined;
  output?: IMessage | undefined;
  ns: INamespace | undefined;
}
export interface IBinding {
  name: string;
  portType: IPortType | undefined;
  ns: INamespace | undefined;
}
export interface IPortType {
  name: string;
  operation: IOperation | undefined;
  ns: INamespace | undefined;
}
export interface IPort {
  name: string;
  binding: IBinding | undefined;
}
export interface IService {
  name: string;
  port?: IPort;
}
export interface INamespace {
  prefix: string;
  ns: string;
}
export interface IDefinition {
  wsdlURL: string;
  name: string;
  ns: INamespace[];
  services: IService[];
  bindings: IBinding[];
  portTypes: IPortType[];
  messages: IMessage[];
  elements: Element[];
}

 