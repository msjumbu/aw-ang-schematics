import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createTestApp, createTestModule } from '../utils/create-test-app';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { ConfigSchema as MyConfigSchema } from './schema';

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { getObjects, getObject } from "../testing/test.wsdls";
import { assertContains, assertNotContains } from '../utils/util';


const collectionPath = path.join(__dirname, '../collection.json');

describe('test with module', () => {
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
    appTree = await createTestModule(projectName, 'test-mod', testRunner, appTree);
  });
  it('should create files', async () => {
    
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
      module: 'test-mod'
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/test-mod/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/test-mod/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/test-mod/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/test-mod/pk/pk.component.ts');
  });

  it('should add imports to module file', async () => {
    
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
      module: 'test-mod'
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/test-mod/test-mod.module.ts');
    expect(fileContent).toContain("import { ReactiveFormsModule } from '@angular/forms';");
    expect(fileContent).toContain("import { MaterialModule } from '../modules/material.module';");
  });

});

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
  it('should contain input panel', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<form [formGroup]="inputForm" [style.display]="showSpinner ? 'none' : 'block'">
    <mat-card class="information-card">
        <mat-card-header>
            <mat-card-title>COM_COUNTRY Input</mat-card-title>
        </mat-card-header>
        <mat-card-content>
            <div class="row"> 
                <div class="col">
                    <mat-form-field>
                        <mat-label>fromCODE</mat-label>
                        <input 
                            type= "text" 
                            name="fromCODE" 
                            matInput 
                            placeholder="" 
                            formControlName="fromCODE"/> 
                    </mat-form-field>
                </div>
                <div class="col">
                    <mat-form-field>
                        <mat-label>toCODE</mat-label>
                        <input 
                            type= "text" 
                            name="toCODE" 
                            matInput 
                            placeholder="" 
                            formControlName="toCODE"/> 
                    </mat-form-field>
                </div>
            </div>
        </mat-card-content>
        <mat-card-actions>
            <button (click)="getData(inputForm.getRawValue())" mat-flat-button color="primary">Submit</button>
        </mat-card-actions>
    </mat-card>
</form>`);
    assertNotContains(htmlContent, `<form [formGroup]="inputForm" [style.display]="showSpinner ? 'none' : 'block'">
      <mat-card class="information-card">
          <mat-card-header>
              <mat-card-title>COM_COUNTRY Input</mat-card-title>
          </mat-card-header>
          <mat-card-content>
              <div class="row"> 
                  <div class="col">
                      <mat-form-field>
                          <mat-label>CODE</mat-label>
                          <input 
                              type= "text" 
                              name="CODE" 
                              matInput 
                              placeholder="" 
                              formControlName="CODE"/> 
                      </mat-form-field>
                  </div>
              </div>
          </mat-card-content>
          <mat-card-actions>
              <button (click)="getData(inputForm.getRawValue())" mat-flat-button color="primary">Submit</button>
          </mat-card-actions>
      </mat-card>
      </form>`);
  });
  it('should contain output table', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<table mat-table [dataSource]="dataSource" [style.display]="showSpinner ? 'none' : 'block'">
    
    <ng-container matColumnDef="CODE">
        <th mat-header-cell *matHeaderCellDef> CODE </th>
        <td mat-cell *matCellDef="let element"> {{element.CODE}} </td>
    </ng-container>`);
    assertContains(htmlContent, `<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>`);
    expect(htmlContent).not.toContain(`<form [formGroup]="outputForm" [style.display]="showSpinner ? 'none' : 'block'">`);
    expect(htmlContent).not.toContain(`<button (click)="saveData(outputForm.getRawValue())" mat-flat-button color="primary">Update</button>`);
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
        this.showSpinner = true;
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
            this.showSpinner = false;
          },
          error: (err) => {
            console.log(err);
            this.showSpinner = false;
          }
        });
      }`)
  });
  it('should not contain savedata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(fileContent).not.toContain("saveData(data: ICOM_COUNTRY)");
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
  it('should not contain table variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).not.toContain("records: ICOM_COUNTRY[] = [];");
    expect(htmlContent).not.toContain("displayedColumns: string[] = [ 'CODE', 'DESCRIPTION', 'MATCHING_TYPE', 'CALENDAR_NAME', 'BASE_CURRENCY', 'IS_ACTIVE', 'CREATED_BY', 'CREATED_ON', 'MODIFIED_BY', 'MODIFIED_ON',]");
    expect(htmlContent).not.toContain("dataSource = new MatTableDataSource<ICOM_COUNTRY>([]);");
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
  it('should contain input panel', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<form [formGroup]="inputForm" [style.display]="showSpinner ? 'none' : 'block'">
    <mat-card class="information-card">
        <mat-card-header>
            <mat-card-title>COM_COUNTRY Input</mat-card-title>
        </mat-card-header>
        <mat-card-content>
            <div class="row"> 
                <div class="col">
                    <mat-form-field>
                        <mat-label>CODE</mat-label>
                        <input 
                            type= "text" 
                            name="CODE" 
                            matInput 
                            placeholder="" 
                            formControlName="CODE"/> 
                    </mat-form-field>
                </div>
            </div>
        </mat-card-content>
        <mat-card-actions>
            <button (click)="getData(inputForm.getRawValue())" mat-flat-button color="primary">Submit</button>
        </mat-card-actions>
    </mat-card>
</form>`);
    assertNotContains(htmlContent, `<mat-form-field>
    <mat-label>fromCODE</mat-label>
    <input 
        type= "text" 
        name="fromCODE" 
        matInput 
        placeholder="" 
        formControlName="fromCODE"/> 
</mat-form-field>`);
  });
  it('should contain output panel', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<form [formGroup]="outputForm" [style.display]="showSpinner ? 'none' : 'block'">
    <mat-card class="information-card">
        <mat-card-header>
            <mat-card-title>COM_COUNTRY Output</mat-card-title>
        </mat-card-header>
        <mat-card-content>
            <div class="row">
                <div class="col">
                    <mat-form-field class="full-width">
                        <mat-label>CODE</mat-label>
                        <input 
                            type= "text" 
                            name="CODE" 
                            matInput 
                            placeholder="" 
                            formControlName="CODE"/> 
                    </mat-form-field>
                </div>`)
    assertContains(htmlContent, `<mat-form-field class="full-width">
        <mat-label>CREATED_ON</mat-label>
        <input 
            type= "datetime" 
            name="CREATED_ON" 
            matInput  
            [matDatepicker]="pickerCREATED_ON" 
            placeholder="" 
            formControlName="CREATED_ON"/>  
            <mat-datepicker-toggle matIconSuffix [for]="pickerCREATED_ON"></mat-datepicker-toggle> 
            <mat-datepicker #pickerCREATED_ON></mat-datepicker>
    </mat-form-field>`);
    assertContains(htmlContent, `        <mat-card-actions>
        <button (click)="saveData(outputForm.getRawValue())" mat-flat-button color="primary">Update</button>
    </mat-card-actions>`);
    expect(htmlContent).not.toContain(`<table mat-table [dataSource]="dataSource" [style.display]="showSpinner ? 'none' : 'block'">`);
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
        this.showSpinner = true;
        this.awService.get(input).subscribe({
          next: (g:OutputMsg) => {
            if (g.tuple && g.tuple.old && g.tuple.old.COM_COUNTRY) {
              this.record = g.tuple.old.COM_COUNTRY;
              this.outputForm.patchValue(this.record);
            }
            console.log(g);
            this.showSpinner = false;
          },
          error: (err) => {
            console.log(err);
            this.showSpinner = false;
          }
        });
      }`)
  });
  it('should contain savedata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(fileContent, `saveData(data: ICOM_COUNTRY) {
      if (!this.record) throw new Error("Old not found");
      
      this.awService.update(this.record, data);
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
  it('should contain input panel', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<p-panel header="COM_COUNTRY Input" [toggleable]="true" [style.display]="showSpinner ? 'none' : 'block'">
    <form [formGroup]="inputForm">
        <label for="fromCODE" class="block text-900 font-medium mb-2">fromCODE</label>
        <input 
            type= "text" 
            name="fromCODE" 
            pInputText 
            class="w-full mb-3" 
            placeholder="" 
            formControlName="fromCODE"/>
        <label for="toCODE" class="block text-900 font-medium mb-2">toCODE</label>
        <input 
            type= "text" 
            name="toCODE" 
            pInputText 
            class="w-full mb-3" 
            placeholder="" 
            formControlName="toCODE"/>
    <button pButton (click)="getData(inputForm.getRawValue())" label="Submit" class="w-full"></button>
  </form>
</p-panel>
`);
    expect(htmlContent).not.toContain(`<label for="CODE" class="block text-900 font-medium mb-2">CODE</label>`);
  });
  it('should contain output panel', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<p-table [value]="records" styleClass="p-datatable-sm" [tableStyle]="{'min-width': '50rem'}" [style.display]="showSpinner ? 'none' : 'block'">
    <ng-template pTemplate="caption">
        COM_COUNTRY Output
    </ng-template>
    <ng-template pTemplate="header">`);
    expect(htmlContent).not.toContain(`<p-panel header="COM_COUNTRY Output" [toggleable]="true">`);
    expect(htmlContent).not.toContain(`<button pButton (click)="saveData(outputForm.getRawValue())" label="Update" class="w-full"></button>`);
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
      this.showSpinner = true;
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
          this.showSpinner = false;
        },
        error: (err) => {
          console.log(err);
          this.showSpinner = false;
        }
      });
    }`)
  });
  it('should not contain savedata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(fileContent).not.toContain("saveData(data: ICOM_COUNTRY)");
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
    expect(htmlContent).toContain("import { ConfigService } from '../config/config.service';");
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
  it('should not contain table variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).not.toContain("records: ICOM_COUNTRY[] = [];");
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
  it('should contain input panel', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<p-panel header="COM_COUNTRY Input" [toggleable]="true" [style.display]="showSpinner ? 'none' : 'block'">
    <form [formGroup]="inputForm">
        <label for="CODE" class="block text-900 font-medium mb-2">CODE</label>
        <input 
            type= "text" 
            name="CODE" 
            pInputText 
            class="w-full mb-3" 
            placeholder="" 
            formControlName="CODE"/>
    <button pButton (click)="getData(inputForm.getRawValue())" label="Submit" class="w-full"></button>
  </form>
</p-panel>`);
    expect(htmlContent).not.toContain(`<label for="fromCODE" class="block text-900 font-medium mb-2">fromCODE</label>`);
  });
  it('should contain output panel', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.html');
    assertContains(htmlContent, `<p-panel header="COM_COUNTRY Output" [toggleable]="true" [style.display]="showSpinner ? 'none' : 'block'">
    <form [formGroup]="outputForm">
    <div class="formgrid grid">
    <div class="field col">
        <label for="CODE" class="block text-900 font-medium mb-2">CODE</label>
        <input 
            type= "text" 
            name="CODE" 
            pInputText 
            class="w-full mb-3"  
            placeholder="" 
            formControlName="CODE"/>
        </div>`)
    assertContains(htmlContent, `<p-calendar inputId="CREATED_ON" formControlName="CREATED_ON" [showTime]=true/>`);
    assertContains(htmlContent, `<button pButton (click)="saveData(outputForm.getRawValue())" label="Update" class="w-full"></button>`);
    expect(htmlContent).not.toContain(`<p-table [value]="records" styleClass="p-datatable-sm" [tableStyle]="{'min-width': '50rem'}">`);
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
        this.showSpinner = true;
        this.awService.get(input).subscribe({
          next: (g:OutputMsg) => {
            if (g.tuple && g.tuple.old && g.tuple.old.COM_COUNTRY) {
              this.record = g.tuple.old.COM_COUNTRY;
              this.outputForm.patchValue(this.record);
            }
            console.log(g);
            this.showSpinner = false;
          },
          error: (err) => {
            console.log(err);
            this.showSpinner = false;
          }
        });
      }`)
  });
  it('should contain savedata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(fileContent, `saveData(data: ICOM_COUNTRY) {
      if (!this.record) throw new Error("Old not found");
      
      this.awService.update(this.record, data);
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
    expect(htmlContent).toContain("import { ConfigService } from '../config/config.service';");
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
      this.showSpinner = true;
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
          this.showSpinner = false;
        },
        error: (err) => {
          console.log(err);
          this.showSpinner = false;
        }
      });
    }`)
  });
  it('should not contain savedata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObjects);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(fileContent).not.toContain("saveData(data: ICOM_COUNTRY)");
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
    expect(htmlContent).toContain("import { ConfigService } from '../config/config.service';");
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
  it('should not contain table variables', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');
    expect(htmlContent).not.toContain("records: ICOM_COUNTRY[] = [];");
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
        this.showSpinner = true;
        this.awService.get(input).subscribe({
          next: (g:OutputMsg) => {
            if (g.tuple && g.tuple.old && g.tuple.old.COM_COUNTRY) {
              this.record = g.tuple.old.COM_COUNTRY;
              this.outputForm.patchValue(this.record);
            }
            console.log(g);
            this.showSpinner = false;
          },
          error: (err) => {
            console.log(err);
            this.showSpinner = false;
          }
        });
      }`)
  });
  it('should contain savedata method', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, getObject);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    const fileContent = tree.readContent('/projects/bar/src/app/pk/pk.component.ts');

    assertContains(fileContent, `saveData(data: ICOM_COUNTRY) {
      if (!this.record) throw new Error("Old not found");
      
      this.awService.update(this.record, data);
    }`)
  });
});


