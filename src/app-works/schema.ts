export interface ConfigSchema {
    gateway_url: string;
    org_dn: string;
    project?: string;
    path?: string;
    root?: string;
    config_path?: string;
    sourceRoot?: string;
    auth_type?: string;
    otds_url?: string;
    ui_framework?: string;
  }