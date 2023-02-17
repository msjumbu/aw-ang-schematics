export interface ConfigSchema {
  wsdl_url: string;
  project?: string;
  path?: string;
  root?: string;
  skipService: boolean;
  sourceRoot?: string;
}