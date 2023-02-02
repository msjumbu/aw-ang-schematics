export interface ConfigSchema {
    otds_url: string;
    gateway_url: string;
    org_dn: string;
    project?: string;
    path?: string;
    root: string;
  }