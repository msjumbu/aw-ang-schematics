import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ConfigSchema as MyServiceSchema } from './schema';

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { getObject, getObjects, noInput } from "../testing/test.wsdls";
import { createTestApp } from '../utils/create-test-app';
import { assertContains } from '../utils/util';

const collectionPath = path.join(__dirname, '../collection.json');

describe('service', () => {

  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const projectName = 'bar';
  describe('with getObject', () => {
    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await createTestApp(projectName, testRunner);
    });
    it('should create files', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const files = tree.files;
      expect(files).toContain('/projects/bar/src/app/test/services/get-com-country-object.service.ts');
      expect(files).toContain('/projects/bar/src/app/test/services/get-com-country-object.types.ts');
    });
    it('should create input type', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.types.ts');
      assertContains(fileContent, `export interface IGetComCountryObject {
        CODE?: string | null;
        meta?: any[];
    }`);
    });
    it('should create response type', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.types.ts');
      assertContains(fileContent, `export interface IGetComCountryObjectResponse {
        tuple?: Ituple;
        meta?: any[];
    }`);
    });
    it('should create tuple', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.types.ts');
      assertContains(fileContent, `export interface Ituple {
        old?: Iold;
        values?: Ivalues[];
        meta?: any[];
    }`);
    });
    it('should create old', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.types.ts');
      assertContains(fileContent, `export interface Iold {
        COM_COUNTRY?: ICOM_COUNTRY;
        meta?: any[];
    }`);
    });
    it('should create ICOM_COUNTRY', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.types.ts');
      assertContains(fileContent, `export interface ICOM_COUNTRY {
        CODE?: string | null;
        DESCRIPTION?: string | null;
        MATCHING_TYPE?: string | null;
        CALENDAR_NAME?: string | null;
        BASE_CURRENCY?: string | null;
        IS_ACTIVE?: string | null;
        CREATED_BY?: string | null;
        CREATED_ON?: Date | null;
        MODIFIED_BY?: string | null;
        MODIFIED_ON?: Date | null;
        SAP_CONTAINER?: string | null;
        IS_SILENT_POSTING?: string | null;
        IS_TOUCHLESS_POSTING?: string | null;
        FISCAL_YEAR_CALC?: number | null;
        FINANCIAL_YEAR_CALC?: number | null;
        EXTRACTION_PATH?: string | null;
        IS_SUPERWISER_REQ?: string | null;
        QC_DISABLED?: string | null;
        COUNTRY_GROUP_CODE?: string | null;
        IS_AUDIT_PROCESS?: string | null;
        IS_EMAIL_WHITELIST?: string | null;
        meta?: any[];
    }`);
    });
    it('should contain imports', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.service.ts');
      expect(fileContent).toContain("import { ConfigService } from '../../config/config.service';");
      expect(fileContent).toContain("import { AuthenticationService, AuthToken } from '../../services/auth/authentication.service';");
      expect(fileContent).toContain("import { Utils } from '../../services/utils';");
      expect(fileContent).toContain("import { IGetComCountryObject, IGetComCountryObjectResponse, metadata, ICOM_COUNTRY } from './get-com-country-object.types';");
    });
    it('should contain service class', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.service.ts');
      expect(fileContent).toContain("export class GetComCountryObjectService {");
      expect(fileContent).toContain("constructor(private http: HttpClient, private authService: AuthenticationService, private configService: ConfigService) { }");
    });
    it('should contain get method', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.service.ts');
      assertContains(fileContent, `get(param: IGetComCountryObject): Subject<IGetComCountryObjectResponse> {
        let o: Subject<IGetComCountryObjectResponse> = new Subject();
        if (!this.authService.auth) {
            throw new Error("User not logged in");
        }
        let req: any = {
            "SOAP:Envelope": {
                "meta": {
                    "xmlns:SOAP": "http://schemas.xmlsoap.org/soap/envelope/"
                },
                "SOAP:Body": {
                    "GetComCountryObject": {
                        "meta": {
                            "xmlns": "http://schemas.cordys.com/MigrationCurrentWsApps"
                        },
                        ...param
                    }
                }
            }
        };

        let builder = new Builder({ attrkey: "meta" });
        let xml = builder.buildObject(req);
        let endpoint = this.configService.config.GATEWAY_URL+'?organization='+this.configService.config.ORG_DN;
        this.http.post(endpoint, xml, { responseType: "text", headers: { "SAMLart": this.authService.auth.token } }).subscribe((data => {
            this.xmlParser.parseString(data, (err, result) => {
                let g: any = result["SOAP:Envelope"]?.["SOAP:Body"]?.["GetComCountryObjectResponse"];
                o.next(g);
                o.complete();
            });
        }));
        return o;
    }
`);
    });
    it('should contain update method', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObject);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-object.service.ts');
      assertContains(fileContent, `update(_old: ICOM_COUNTRY, _new: ICOM_COUNTRY): Subject<any> {
        let o: Subject<any> = new Subject();
        if (!this.authService.auth) {
            throw new Error("User not logged in");
        }
        let oldData = JSON.parse(JSON.stringify(_old));
        let newData = JSON.parse(JSON.stringify(_new));
        let req: any = {
            "SOAP:Envelope": {
                "meta": {
                    "xmlns:SOAP": "http://schemas.xmlsoap.org/soap/envelope/"
                },
                "SOAP:Body": {
                    "Update": {
                        "meta": {
                            "xmlns": "http://schemas.cordys.com/MigrationCurrentWsApps"
                        },
                        "tuple": {
                            "old": {
                                "COM_COUNTRY": {
                                    ...oldData
                                }
                            },
                            "new": {
                                "COM_COUNTRY": {
                                    ...newData
                                }
                            }
                        }
                    }
                }
            }
        };

        let builder = new Builder({ attrkey: "meta" });
        let xml = builder.buildObject(req);
        let endpoint = this.configService.config.GATEWAY_URL + '?organization=' + this.configService.config.ORG_DN;
        this.http.post(endpoint, xml, { responseType: "text", headers: { "SAMLart": this.authService.auth.token } }).subscribe((data => {
            this.xmlParser.parseString(data, (err, result) => {
                let g: any = result["SOAP:Envelope"]?.["SOAP:Body"]?.["UpdateResponse"];
                o.next(g);
                o.complete();
            });
        }));
        return o;
    }
`);
    });

  });
  describe('with getObjects', () => {
    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await createTestApp(projectName, testRunner);
    });
    it('should create files', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const files = tree.files;
      expect(files).toContain('/projects/bar/src/app/test/services/get-com-country-objects.service.ts');
      expect(files).toContain('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
    });
    it('should create cursor', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
      assertContains(fileContent, `export interface Icursor {
        meta?: {
            id?: string | null;
            position?: string | null;
            numRows?: string | null;
            maxRows?: string | null;
            sameConnection?: string | null;
        };
        _?: string | null;
    }`);
    });
    it('should create response type', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
      assertContains(fileContent, `export interface IGetComCountryObjectsResponse {
        cursor?: Icursor;
        tuple?: Ituple[];
        meta?: any[];
    }`);
    });

    it('should create input type', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
      assertContains(fileContent, `export interface IGetComCountryObjects {
        cursor?: Icursor;
        fromCODE?: string | null;
        toCODE?: string | null;
        meta?: any[];
    }`);
    });
    it('should create tuple', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
      assertContains(fileContent, `export interface Ituple {
        old?: Iold;
        values?: Ivalues[];
        meta?: any[];
    }`);
    });
    it('should create old', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
      assertContains(fileContent, `export interface Iold {
        COM_COUNTRY?: ICOM_COUNTRY;
        meta?: any[];
    }`);
    });
    it('should create old', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
      assertContains(fileContent, `export interface Iold {
        COM_COUNTRY?: ICOM_COUNTRY;
        meta?: any[];
    }`);
    });
    it('should create ICOM_COUNTRY', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.types.ts');
      assertContains(fileContent, `export interface ICOM_COUNTRY {
        CODE?: string | null;
        DESCRIPTION?: string | null;
        MATCHING_TYPE?: string | null;
        CALENDAR_NAME?: string | null;
        BASE_CURRENCY?: string | null;
        IS_ACTIVE?: string | null;
        CREATED_BY?: string | null;
        CREATED_ON?: Date | null;
        MODIFIED_BY?: string | null;
        MODIFIED_ON?: Date | null;
        SAP_CONTAINER?: string | null;
        IS_SILENT_POSTING?: string | null;
        IS_TOUCHLESS_POSTING?: string | null;
        FISCAL_YEAR_CALC?: number | null;
        FINANCIAL_YEAR_CALC?: number | null;
        EXTRACTION_PATH?: string | null;
        IS_SUPERWISER_REQ?: string | null;
        QC_DISABLED?: string | null;
        COUNTRY_GROUP_CODE?: string | null;
        IS_AUDIT_PROCESS?: string | null;
        IS_EMAIL_WHITELIST?: string | null;
        meta?: any[];
    }`);
    });
    it('should contain imports', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.service.ts');
      expect(fileContent).toContain("import { ConfigService } from '../../config/config.service';");
      expect(fileContent).toContain("import { AuthenticationService, AuthToken } from '../../services/auth/authentication.service';");
      expect(fileContent).toContain("import { Utils } from '../../services/utils';");
      expect(fileContent).toContain("import { IGetComCountryObjects, IGetComCountryObjectsResponse, metadata, ICOM_COUNTRY } from './get-com-country-objects.types';");
    });
    it('should contain service class', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.service.ts');
      expect(fileContent).toContain("export class GetComCountryObjectsService {");
      expect(fileContent).toContain("constructor(private http: HttpClient, private authService: AuthenticationService, private configService: ConfigService) { }");
    });
    it('should contain get method', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.service.ts');
      assertContains(fileContent, `get(param: IGetComCountryObjects): Subject<IGetComCountryObjectsResponse> {
        let o: Subject<IGetComCountryObjectsResponse> = new Subject();
        if (!this.authService.auth) {
            throw new Error("User not logged in");
        }
        let req: any = {
            "SOAP:Envelope": {
                "meta": {
                    "xmlns:SOAP": "http://schemas.xmlsoap.org/soap/envelope/"
                },
                "SOAP:Body": {
                    "GetComCountryObjects": {
                        "meta": {
                            "xmlns": "http://schemas.cordys.com/MigrationCurrentWsApps"
                        },
                        ...param
                    }
                }
            }
        };

        let builder = new Builder({ attrkey: "meta" });
        let xml = builder.buildObject(req);
        let endpoint = this.configService.config.GATEWAY_URL+'?organization='+this.configService.config.ORG_DN;
        this.http.post(endpoint, xml, { responseType: "text", headers: { "SAMLart": this.authService.auth.token } }).subscribe((data => {
            this.xmlParser.parseString(data, (err, result) => {
                let g: any = result["SOAP:Envelope"]?.["SOAP:Body"]?.["GetComCountryObjectsResponse"];
                o.next(g);
                o.complete();
            });
        }));
        return o;
    }`);
    });
    it('should contain update method', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, getObjects);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-com-country-objects.service.ts');
      assertContains(fileContent, `update(_old: ICOM_COUNTRY, _new: ICOM_COUNTRY): Subject<any> {
        let o: Subject<any> = new Subject();
        if (!this.authService.auth) {
            throw new Error("User not logged in");
        }
        let oldData = JSON.parse(JSON.stringify(_old));
        let newData = JSON.parse(JSON.stringify(_new));
        let req: any = {
            "SOAP:Envelope": {
                "meta": {
                    "xmlns:SOAP": "http://schemas.xmlsoap.org/soap/envelope/"
                },
                "SOAP:Body": {
                    "Update": {
                        "meta": {
                            "xmlns": "http://schemas.cordys.com/MigrationCurrentWsApps"
                        },
                        "tuple": {
                            "old": {
                                "COM_COUNTRY": {
                                    ...oldData
                                }
                            },
                            "new": {
                                "COM_COUNTRY": {
                                    ...newData
                                }
                            }
                        }
                    }
                }
            }
        };

        let builder = new Builder({ attrkey: "meta" });
        let xml = builder.buildObject(req);
        let endpoint = this.configService.config.GATEWAY_URL + '?organization=' + this.configService.config.ORG_DN;
        this.http.post(endpoint, xml, { responseType: "text", headers: { "SAMLart": this.authService.auth.token } }).subscribe((data => {
            this.xmlParser.parseString(data, (err, result) => {
                let g: any = result["SOAP:Envelope"]?.["SOAP:Body"]?.["UpdateResponse"];
                o.next(g);
                o.complete();
            });
        }));
        return o;
    }`);
    });
  });
  describe('with noInput', () => {
    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await createTestApp(projectName, testRunner);
    });
    it('should create files', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const files = tree.files;
      expect(files).toContain('/projects/bar/src/app/test/services/get-all-transactions.service.ts');
      expect(files).toContain('/projects/bar/src/app/test/services/get-all-transactions.types.ts');
    });
    it('should create input type', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.types.ts');
      assertContains(fileContent, `export interface IGetAllTransactions {
      }`);
    });
    it('should create response type', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.types.ts');
      assertContains(fileContent, `export interface IGetAllTransactionsResponse {
        tuple?: Ituple[];
        meta?: any[];
    }`);
    });
    it('should create tuple', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.types.ts');
      assertContains(fileContent, `export interface Ituple {
        old?: Iold;
        meta?: any[];
    }`);
    });
    it('should create old', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.types.ts');
      assertContains(fileContent, `export interface Iold {
        SCM_SO_TRANSACTION?: ISCM_SO_TRANSACTION;
        meta?: any[];
    }`);
    });
    it('should create ISCM_SO_TRANSACTION', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.types.ts');
      assertContains(fileContent, `export interface ISCM_SO_TRANSACTION {
        TRANSACTION_ID?: string | null;
        REQUEST_ID?: string | null;
        RELATED_TRANSACTION?: string | null;
        ENTITY?: string | null;
        CURRENCY?: string | null;
        COUNTRY?: string | null;
        PRODUCT?: string | null;
        INITIATED_DATE?: Date | null;
        INITIATED_BY?: string | null;
        REQUESTOR_EMAIL_ID?: string | null;
        RUSH_INDICATOR?: number | null;
        INITIATION_MODE?: string | null;
        REQUEST_DATE?: Date | null;
        TYPE_OF_PROCESS?: string | null;
        TYPE_OF_REQUEST?: string | null;
        SALES_TYPE?: string | null;
        REGION?: string | null;
        PREAPPROVED?: string | null;
        AUTO_POST_DO?: number | null;
        AUTO_POST_BO?: number | null;
        ADDITIONAL_TO_EMAILID?: string | null;
        ADDITIONAL_TO_CC_EMAILID?: string | null;
        CREATED_ON?: Date | null;
        CREATED_BY?: string | null;
        MODIFIED_ON?: Date | null;
        MODIFIED_BY?: string | null;
        LAST_ACTED_BY?: string | null;
        SOLD_TO_PARTY_CODE?: string | null;
        SOLD_TO_PARTY_NAME?: string | null;
        STAGE?: string | null;
        SO_APPLICABLE?: boolean | null;
        SC_APPLICABLE?: boolean | null;
        DO_APPLICABLE?: boolean | null;
        BILLING_APPLICABLE?: boolean | null;
        STATUS?: string | null;
        SUB_PRODUCT?: string | null;
        ASSIGNED_TO_TEAM?: string | null;
        ASSIGNED_TO_USER?: string | null;
        REJECT_REASON?: string | null;
        REJECT_COMMENT?: string | null;
        BPM_INSTANCE_ID?: string | null;
        CUSTOMER_PO_NO?: string | null;
        SALES_ORG_CODE?: string | null;
        DIST_CHANNEL?: string | null;
        DIVISION?: string | null;
        SALES_ORDER_NUMBER?: string | null;
        DELIVERY_NUMBER?: string | null;
        BILLING_NUMBER?: string | null;
        SALES_CONTRACT_NUMBER?: string | null;
        ORDER_REASON_DESC?: string | null;
        PRICE_TYPE?: string | null;
        ORDER_TYPE_ACTION?: string | null;
        PRICE_TYPE_VAL?: string | null;
        ORDER_REASON_CODE?: string | null;
        ORDER_TYPE?: string | null;
        MVP_DONE?: number | null;
        CC_DONE?: number | null;
        DD_DONE?: number | null;
        OVERRIDE_DUPLICATE?: number | null;
        MODE_OF_CREATION?: string | null;
        SQ_APPLICABLE?: boolean | null;
        PAYMENT_TERMS?: string | null;
        INCO_TERMS?: string | null;
        INCO_TERMS_DESCRIPTION?: string | null;
        PAYMENT_TERMS_DESCRIPTION?: string | null;
        AUTO_POST_SO?: number | null;
        CREDITBLOCK_INSTANCE_ID?: string | null;
        ORDER_CONDITION_TYPE?: string | null;
        SHIP_TO_PARTY_CODE?: string | null;
        SHIP_TO_PARTY_NAME?: string | null;
        REQUIRED_DELEVERY_DATE?: Date | null;
        SQ_ACTION?: string | null;
        SC_ACTION?: string | null;
        SO_ACTION?: string | null;
        DO_ACTION?: string | null;
        BO_ACTION?: string | null;
        IS_MIGRATED?: number | null;
        ORIGIN_DATE?: Date | null;
        VERSION?: number | null;
        TYPE_OF_CHECK?: string | null;
        REQUESTED_VALUE?: number | null;
        CREDIT_AVAILABILITY?: number | null;
        CREDIT_OUTSTANDING?: number | null;
        PLANT?: string | null;
        STORAGE_LOCATION?: string | null;
        PO_DATE?: Date | null;
        SALES_GROUP?: string | null;
        SALES_OFFICE?: string | null;
        IS_SO_BLOCKED?: string | null;
        BOOK_TYPE?: string | null;
        CREDIT_EXPOSURE?: number | null;
        ORDER_VALUE?: number | null;
        APPROVAL_STATUS?: string | null;
        ROUTE?: string | null;
        SR_ACTION?: string | null;
        NO_OF_REQUESTS?: number | null;
        meta?: any[];
    }`);
    });
    it('should contain imports', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.service.ts');
      expect(fileContent).toContain("import { ConfigService } from '../../config/config.service';");
      expect(fileContent).toContain("import { AuthenticationService, AuthToken } from '../../services/auth/authentication.service';");
      expect(fileContent).toContain("import { Utils } from '../../services/utils';");
      expect(fileContent).toContain("import { IGetAllTransactions, IGetAllTransactionsResponse, metadata, ISCM_SO_TRANSACTION } from './get-all-transactions.types';");
    });
    it('should contain service class', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.service.ts');
      expect(fileContent).toContain("export class GetAllTransactionsService {");
      expect(fileContent).toContain("constructor(private http: HttpClient, private authService: AuthenticationService, private configService: ConfigService) { }");
    });
    it('should contain get method', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.service.ts');
      assertContains(fileContent, `    get(param: IGetAllTransactions): Subject<IGetAllTransactionsResponse> {
        let o: Subject<IGetAllTransactionsResponse> = new Subject();
        if (!this.authService.auth) {
            throw new Error("User not logged in");
        }
        let req: any = {
            "SOAP:Envelope": {
                "meta": {
                    "xmlns:SOAP": "http://schemas.xmlsoap.org/soap/envelope/"
                },
                "SOAP:Body": {
                    "GetAllTransactions": {
                        "meta": {
                            "xmlns": "http://schemas.cordys.com/salesorderdatabasemetadata"
                        },
                        ...param
                    }
                }
            }
        };

        let builder = new Builder({ attrkey: "meta" });
        let xml = builder.buildObject(req);
        let endpoint = this.configService.config.GATEWAY_URL+'?organization='+this.configService.config.ORG_DN;
        this.http.post(endpoint, xml, { responseType: "text", headers: { "SAMLart": this.authService.auth.token } }).subscribe((data => {
            this.xmlParser.parseString(data, (err, result) => {
                let g: any = result["SOAP:Envelope"]?.["SOAP:Body"]?.["GetAllTransactionsResponse"];
                o.next(g);
                o.complete();
            });
        }));
        return o;
    }`);
    });
    it('should contain update method', async () => {
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, noInput);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const fileContent = tree.readContent('/projects/bar/src/app/test/services/get-all-transactions.service.ts');
      assertContains(fileContent, `    update(_old: ISCM_SO_TRANSACTION, _new: ISCM_SO_TRANSACTION): Subject<any> {
        let o: Subject<any> = new Subject();
        if (!this.authService.auth) {
            throw new Error("User not logged in");
        }
        let oldData = JSON.parse(JSON.stringify(_old));
        let newData = JSON.parse(JSON.stringify(_new));
        let req: any = {
            "SOAP:Envelope": {
                "meta": {
                    "xmlns:SOAP": "http://schemas.xmlsoap.org/soap/envelope/"
                },
                "SOAP:Body": {
                    "Update": {
                        "meta": {
                            "xmlns": "http://schemas.cordys.com/salesorderdatabasemetadata"
                        },
                        "tuple": {
                            "old": {
                                "SCM_SO_TRANSACTION": {
                                    ...oldData
                                }
                            },
                            "new": {
                                "SCM_SO_TRANSACTION": {
                                    ...newData
                                }
                            }
                        }
                    }
                }
            }
        };

        let builder = new Builder({ attrkey: "meta" });
        let xml = builder.buildObject(req);
        let endpoint = this.configService.config.GATEWAY_URL + '?organization=' + this.configService.config.ORG_DN;
        this.http.post(endpoint, xml, { responseType: "text", headers: { "SAMLart": this.authService.auth.token } }).subscribe((data => {
            this.xmlParser.parseString(data, (err, result) => {
                let g: any = result["SOAP:Envelope"]?.["SOAP:Body"]?.["UpdateResponse"];
                o.next(g);
                o.complete();
            });
        }));
        return o;
    }`);
    });
  });
});
