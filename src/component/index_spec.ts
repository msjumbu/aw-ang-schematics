import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createTestApp } from '../utils/create-test-app';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { ConfigSchema as MyConfigSchema } from './schema';

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { getObjects, getObject } from "./test/test.wsdls";

const collectionPath = path.join(__dirname, '../collection.json');

describe('getObjects with material', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const projectName = 'bar';

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: projectName,
    auth_type: 'AW',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should create files', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.ts');
  });

  it('should contain imports', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(fileContent).toContain("import { GetComCountryObjectsService as AWService} from './services/get-com-country-objects.service';");
    expect(fileContent).toContain("import { IGetComCountryObjects as InputMsg, IGetComCountryObjectsResponse as OutputMsg, Ituple , ICOM_COUNTRY} from './services/get-com-country-objects.types';");
    expect(fileContent).toContain("import {MatTableDataSource} from '@angular/material/table';");
    expect(fileContent).toContain("import { ConfigService } from '../config/config.service'");
  });
  it('should contain variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).toContain("records: ICOM_COUNTRY[] = [];");
    expect(htmlContent).toContain("displayedColumns: string[] = [ 'CODE', 'DESCRIPTION', 'MATCHING_TYPE', 'CALENDAR_NAME', 'BASE_CURRENCY', 'IS_ACTIVE', 'CREATED_BY', 'CREATED_ON', 'MODIFIED_BY', 'MODIFIED_ON',]");
    expect(htmlContent).toContain("dataSource = new MatTableDataSource<ICOM_COUNTRY>([]);");
  });
  it('should contain input form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `inputForm = this.fb.group({
        fromCODE: new FormControl<string|null>(null,[]),
        toCODE: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain output form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `outputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
        DESCRIPTION: new FormControl<string|null>(null,[]),
        MATCHING_TYPE: new FormControl<string|null>(null,[]),
        CALENDAR_NAME: new FormControl<string|null>(null,[]),
        BASE_CURRENCY: new FormControl<string|null>(null,[]),
        IS_ACTIVE: new FormControl<string|null>(null,[]),
        CREATED_BY: new FormControl<string|null>(null,[]),
        CREATED_ON: new FormControl<Date|null>(null,[]),
        MODIFIED_BY: new FormControl<string|null>(null,[]),
        MODIFIED_ON: new FormControl<Date|null>(null,[]),
        SAP_CONTAINER: new FormControl<string|null>(null,[]),
        IS_SILENT_POSTING: new FormControl<string|null>(null,[]),
        IS_TOUCHLESS_POSTING: new FormControl<string|null>(null,[]),
        FISCAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        FINANCIAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        EXTRACTION_PATH: new FormControl<string|null>(null,[]),
        IS_SUPERWISER_REQ: new FormControl<string|null>(null,[]),
        QC_DISABLED: new FormControl<string|null>(null,[]),
        COUNTRY_GROUP_CODE: new FormControl<string|null>(null,[]),
        IS_AUDIT_PROCESS: new FormControl<string|null>(null,[]),
        IS_EMAIL_WHITELIST: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain getdata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `getData(input: InputMsg): void {
        this.awService.get(input).subscribe({
          next: (g:OutputMsg) => {
            this.records = [];
            if (g.tuple) {
              for (let index = 0; index < g.tuple.length; index++) {
                const element = g.tuple[index];
                if (element.old && element.old.COM_COUNTRY)
                  this.records.push(element.old.COM_COUNTRY)
              }
            }
            this.dataSource = new MatTableDataSource<ICOM_COUNTRY>(this.records);
    
            console.log(g);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }`)
  });
});

describe('getObject with material', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const projectName = 'bar';

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: projectName,
    auth_type: 'AW',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should create files', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.ts');

    // expect(tree.files).not.toEqual([]);
  });
  it('should contain imports', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(fileContent).toContain("import { GetComCountryObjectService as AWService} from './services/get-com-country-object.service';");
    expect(fileContent).toContain("import { IGetComCountryObject as InputMsg, IGetComCountryObjectResponse as OutputMsg, Ituple , ICOM_COUNTRY} from './services/get-com-country-object.types';");
    expect(fileContent).toContain("import { ConfigService } from '../config/config.service'");
  });
  it('should contain variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).toContain("record: ICOM_COUNTRY | undefined;");
  });
  it('should contain input form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    assertContains(htmlContent, `inputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain output form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `outputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
        DESCRIPTION: new FormControl<string|null>(null,[]),
        MATCHING_TYPE: new FormControl<string|null>(null,[]),
        CALENDAR_NAME: new FormControl<string|null>(null,[]),
        BASE_CURRENCY: new FormControl<string|null>(null,[]),
        IS_ACTIVE: new FormControl<string|null>(null,[]),
        CREATED_BY: new FormControl<string|null>(null,[]),
        CREATED_ON: new FormControl<Date|null>(null,[]),
        MODIFIED_BY: new FormControl<string|null>(null,[]),
        MODIFIED_ON: new FormControl<Date|null>(null,[]),
        SAP_CONTAINER: new FormControl<string|null>(null,[]),
        IS_SILENT_POSTING: new FormControl<string|null>(null,[]),
        IS_TOUCHLESS_POSTING: new FormControl<string|null>(null,[]),
        FISCAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        FINANCIAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        EXTRACTION_PATH: new FormControl<string|null>(null,[]),
        IS_SUPERWISER_REQ: new FormControl<string|null>(null,[]),
        QC_DISABLED: new FormControl<string|null>(null,[]),
        COUNTRY_GROUP_CODE: new FormControl<string|null>(null,[]),
        IS_AUDIT_PROCESS: new FormControl<string|null>(null,[]),
        IS_EMAIL_WHITELIST: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain getdata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `getData(input: InputMsg): void {
        this.awService.get(input).subscribe({
          next: (g:OutputMsg) => {
            if (g.tuple && g.tuple.old && g.tuple.old.COM_COUNTRY) {
              this.record = g.tuple.old.COM_COUNTRY;
              this.outputForm.patchValue(this.record);
            }
            console.log(g);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }`)
  });
});

describe('getObjects with primeng', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const projectName = 'bar';

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: projectName,
    auth_type: 'AW',
    ui_framework: 'primeng',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should create files', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.ts');
  });

  it('should contain imports', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(fileContent).toContain("import { GetComCountryObjectsService as AWService} from './services/get-com-country-objects.service';");
    expect(fileContent).toContain("import { IGetComCountryObjects as InputMsg, IGetComCountryObjectsResponse as OutputMsg, Ituple , ICOM_COUNTRY} from './services/get-com-country-objects.types';");
    expect(fileContent).toContain("import { ConfigService } from '../config/config.service'");
  });
  it('should contain variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).toContain("records: ICOM_COUNTRY[] = [];");
  });
  it('should contain input form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `inputForm = this.fb.group({
        fromCODE: new FormControl<string|null>(null,[]),
        toCODE: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain output form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `outputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
        DESCRIPTION: new FormControl<string|null>(null,[]),
        MATCHING_TYPE: new FormControl<string|null>(null,[]),
        CALENDAR_NAME: new FormControl<string|null>(null,[]),
        BASE_CURRENCY: new FormControl<string|null>(null,[]),
        IS_ACTIVE: new FormControl<string|null>(null,[]),
        CREATED_BY: new FormControl<string|null>(null,[]),
        CREATED_ON: new FormControl<Date|null>(null,[]),
        MODIFIED_BY: new FormControl<string|null>(null,[]),
        MODIFIED_ON: new FormControl<Date|null>(null,[]),
        SAP_CONTAINER: new FormControl<string|null>(null,[]),
        IS_SILENT_POSTING: new FormControl<string|null>(null,[]),
        IS_TOUCHLESS_POSTING: new FormControl<string|null>(null,[]),
        FISCAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        FINANCIAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        EXTRACTION_PATH: new FormControl<string|null>(null,[]),
        IS_SUPERWISER_REQ: new FormControl<string|null>(null,[]),
        QC_DISABLED: new FormControl<string|null>(null,[]),
        COUNTRY_GROUP_CODE: new FormControl<string|null>(null,[]),
        IS_AUDIT_PROCESS: new FormControl<string|null>(null,[]),
        IS_EMAIL_WHITELIST: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain getdata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `getData(input: InputMsg): void {
      this.awService.get(input).subscribe({
        next: (g:OutputMsg) => {
          this.records = [];
          if (g.tuple) {
            for (let index = 0; index < g.tuple.length; index++) {
              const element = g.tuple[index];
              if (element.old && element.old.COM_COUNTRY)
                this.records.push(element.old.COM_COUNTRY)
            }
          }
  
          console.log(g);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }`)
  });
});

describe('getObject with primeng', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const projectName = 'bar';

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: projectName,
    auth_type: 'AW',
    ui_framework: 'primeng',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should create files', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.ts');

    // expect(tree.files).not.toEqual([]);
  });
  it('should contain imports', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    
    expect(htmlContent).toContain("import { GetComCountryObjectService as AWService} from './services/get-com-country-object.service';");
    expect(htmlContent).toContain("import { IGetComCountryObject as InputMsg, IGetComCountryObjectResponse as OutputMsg, Ituple , ICOM_COUNTRY} from './services/get-com-country-object.types';");
  });
  it('should contain variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).toContain("record: ICOM_COUNTRY | undefined;");
  });
  it('should contain input form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    assertContains(htmlContent, `inputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain output form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `outputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
        DESCRIPTION: new FormControl<string|null>(null,[]),
        MATCHING_TYPE: new FormControl<string|null>(null,[]),
        CALENDAR_NAME: new FormControl<string|null>(null,[]),
        BASE_CURRENCY: new FormControl<string|null>(null,[]),
        IS_ACTIVE: new FormControl<string|null>(null,[]),
        CREATED_BY: new FormControl<string|null>(null,[]),
        CREATED_ON: new FormControl<Date|null>(null,[]),
        MODIFIED_BY: new FormControl<string|null>(null,[]),
        MODIFIED_ON: new FormControl<Date|null>(null,[]),
        SAP_CONTAINER: new FormControl<string|null>(null,[]),
        IS_SILENT_POSTING: new FormControl<string|null>(null,[]),
        IS_TOUCHLESS_POSTING: new FormControl<string|null>(null,[]),
        FISCAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        FINANCIAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        EXTRACTION_PATH: new FormControl<string|null>(null,[]),
        IS_SUPERWISER_REQ: new FormControl<string|null>(null,[]),
        QC_DISABLED: new FormControl<string|null>(null,[]),
        COUNTRY_GROUP_CODE: new FormControl<string|null>(null,[]),
        IS_AUDIT_PROCESS: new FormControl<string|null>(null,[]),
        IS_EMAIL_WHITELIST: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain getdata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `getData(input: InputMsg): void {
        this.awService.get(input).subscribe({
          next: (g:OutputMsg) => {
            if (g.tuple && g.tuple.old && g.tuple.old.COM_COUNTRY) {
              this.record = g.tuple.old.COM_COUNTRY;
              this.outputForm.patchValue(this.record);
            }
            console.log(g);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }`)
  });
});

describe('getObjects with clarity', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const projectName = 'bar';

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: projectName,
    auth_type: 'AW',
    ui_framework: 'clarity',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should create files', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.ts');
  });

  it('should contain imports', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');    
    expect(htmlContent).toContain("import { GetComCountryObjectsService as AWService} from './services/get-com-country-objects.service';");
    expect(htmlContent).toContain("import { IGetComCountryObjects as InputMsg, IGetComCountryObjectsResponse as OutputMsg, Ituple , ICOM_COUNTRY} from './services/get-com-country-objects.types';");
  });
  it('should contain variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).toContain("records: ICOM_COUNTRY[] = [];");
  });
  it('should contain input form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `inputForm = this.fb.group({
        fromCODE: new FormControl<string|null>(null,[]),
        toCODE: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain output form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `outputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
        DESCRIPTION: new FormControl<string|null>(null,[]),
        MATCHING_TYPE: new FormControl<string|null>(null,[]),
        CALENDAR_NAME: new FormControl<string|null>(null,[]),
        BASE_CURRENCY: new FormControl<string|null>(null,[]),
        IS_ACTIVE: new FormControl<string|null>(null,[]),
        CREATED_BY: new FormControl<string|null>(null,[]),
        CREATED_ON: new FormControl<Date|null>(null,[]),
        MODIFIED_BY: new FormControl<string|null>(null,[]),
        MODIFIED_ON: new FormControl<Date|null>(null,[]),
        SAP_CONTAINER: new FormControl<string|null>(null,[]),
        IS_SILENT_POSTING: new FormControl<string|null>(null,[]),
        IS_TOUCHLESS_POSTING: new FormControl<string|null>(null,[]),
        FISCAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        FINANCIAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        EXTRACTION_PATH: new FormControl<string|null>(null,[]),
        IS_SUPERWISER_REQ: new FormControl<string|null>(null,[]),
        QC_DISABLED: new FormControl<string|null>(null,[]),
        COUNTRY_GROUP_CODE: new FormControl<string|null>(null,[]),
        IS_AUDIT_PROCESS: new FormControl<string|null>(null,[]),
        IS_EMAIL_WHITELIST: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain getdata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `getData(input: InputMsg): void {
      this.awService.get(input).subscribe({
        next: (g:OutputMsg) => {
          this.records = [];
          if (g.tuple) {
            for (let index = 0; index < g.tuple.length; index++) {
              const element = g.tuple[index];
              if (element.old && element.old.COM_COUNTRY)
                this.records.push(element.old.COM_COUNTRY)
            }
          }
  
          console.log(g);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }`)
  });
});

describe('getObject with clarity', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const projectName = 'bar';

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: projectName,
    auth_type: 'AW',
    ui_framework: 'clarity',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should create files', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.ts');

    // expect(tree.files).not.toEqual([]);
  });
  it('should contain imports', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    
    expect(htmlContent).toContain("import { GetComCountryObjectService as AWService} from './services/get-com-country-object.service';");
    expect(htmlContent).toContain("import { IGetComCountryObject as InputMsg, IGetComCountryObjectResponse as OutputMsg, Ituple , ICOM_COUNTRY} from './services/get-com-country-object.types';");
  });
  it('should contain variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).toContain("record: ICOM_COUNTRY | undefined;");
  });
  it('should contain input form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    assertContains(htmlContent, `inputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain output form group', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `outputForm = this.fb.group({
        CODE: new FormControl<string|null>(null,[]),
        DESCRIPTION: new FormControl<string|null>(null,[]),
        MATCHING_TYPE: new FormControl<string|null>(null,[]),
        CALENDAR_NAME: new FormControl<string|null>(null,[]),
        BASE_CURRENCY: new FormControl<string|null>(null,[]),
        IS_ACTIVE: new FormControl<string|null>(null,[]),
        CREATED_BY: new FormControl<string|null>(null,[]),
        CREATED_ON: new FormControl<Date|null>(null,[]),
        MODIFIED_BY: new FormControl<string|null>(null,[]),
        MODIFIED_ON: new FormControl<Date|null>(null,[]),
        SAP_CONTAINER: new FormControl<string|null>(null,[]),
        IS_SILENT_POSTING: new FormControl<string|null>(null,[]),
        IS_TOUCHLESS_POSTING: new FormControl<string|null>(null,[]),
        FISCAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        FINANCIAL_YEAR_CALC: new FormControl<number|null>(null,[]),
        EXTRACTION_PATH: new FormControl<string|null>(null,[]),
        IS_SUPERWISER_REQ: new FormControl<string|null>(null,[]),
        QC_DISABLED: new FormControl<string|null>(null,[]),
        COUNTRY_GROUP_CODE: new FormControl<string|null>(null,[]),
        IS_AUDIT_PROCESS: new FormControl<string|null>(null,[]),
        IS_EMAIL_WHITELIST: new FormControl<string|null>(null,[]),
      });`)
  });
  it('should contain getdata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(htmlContent, `getData(input: InputMsg): void {
        this.awService.get(input).subscribe({
          next: (g:OutputMsg) => {
            if (g.tuple && g.tuple.old && g.tuple.old.COM_COUNTRY) {
              this.record = g.tuple.old.COM_COUNTRY;
              this.outputForm.patchValue(this.record);
            }
            console.log(g);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }`)
  });
});


function stripWhitespace(str: string) {
  return str.replace(/\s/g, '');
}

function assertContains(source: string, targetString: string) {
  expect(stripWhitespace(source)).toContain(stripWhitespace(targetString));
}