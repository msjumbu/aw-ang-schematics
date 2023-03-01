import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { ConfigSchema as MyConfigSchema } from './schema';
import { createTestApp } from '../utils/create-test-app';
import { readConfig } from '../utils/util';

const collectionPath = path.join(__dirname, '../collection.json');

const testRunner = new SchematicTestRunner(
  'rocket',
  require.resolve(collectionPath),
);
const schematicRunner = new SchematicTestRunner(
  'msjumbu', collectionPath);
const projectName = 'bar';

describe('OTDS Authentication', () => {
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: 'bar',
    auth_type: 'OTDS',
    otds_url: 'rest',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should configure OTDS support', async () => {
    const otdsOptions: MyConfigSchema = {
      auth_type: 'OTDS',
      otds_url: 'rest',
      project: projectName
    };
    const tree = await schematicRunner.runSchematic('authenticate', otdsOptions, appTree);
    const files = tree.files;
    expect(files).toContain('/projects/bar/src/app/services/auth/authentication.service.ts');
    expect(files).toContain('/projects/bar/src/app/services/auth/auth-guard.service.ts');
    let auth_type = readConfig(tree, '/projects/bar/src', 'AUTH_TYPE');
    expect(auth_type).toEqual('OTDS');
    let otds_url = readConfig(tree, '/projects/bar/src', 'OTDS_URL');
    expect(otds_url).toEqual('rest');
    const htmlContent = tree.readContent('/projects/bar/src/app/services/auth/authentication.service.ts');
    expect(htmlContent).toContain("async authenticate");
    expect(htmlContent).toContain("public isAuthenticated(): boolean {");
    expect(htmlContent).toContain("import { firstValueFrom } from 'rxjs';");
    expect(htmlContent).toContain("private xmlParser = new Parser({");
    expect(htmlContent).toContain("async authOTDS");
    expect(htmlContent).toContain("async getSAML");
    expect(htmlContent).toContain("async authAW");
    expect(htmlContent).toContain("interface OTDSTicket");
  });
});

describe('AW Authentication', () => {
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: 'bar',
    auth_type: 'AW',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should configure AW', async () => {
    const otdsOptions: MyConfigSchema = {
      auth_type: 'AW',
      project: projectName
    };
    const tree = await schematicRunner.runSchematic('authenticate', otdsOptions, appTree);
    const files = tree.files;
    expect(files).toContain('/projects/bar/src/app/services/auth/authentication.service.ts');
    expect(files).toContain('/projects/bar/src/app/services/auth/auth-guard.service.ts');
    let auth_type = readConfig(tree, '/projects/bar/src', 'AUTH_TYPE')
    expect(auth_type).toEqual('AW');
    const htmlContent = tree.readContent('/projects/bar/src/app/services/auth/authentication.service.ts');
    expect(htmlContent).toContain("async authenticate");
    expect(htmlContent).toContain("public isAuthenticated(): boolean {");
    expect(htmlContent).toContain("import { firstValueFrom } from 'rxjs';");
    expect(htmlContent).toContain("private xmlParser = new Parser({");
    expect(htmlContent).toContain("async authOTDS");
    expect(htmlContent).toContain("async getSAML");
    expect(htmlContent).toContain("async authAW");
    expect(htmlContent).toContain("interface OTDSTicket");
  });
});

describe('Custom Authentication', () => {
  const awOptions: AWSchema = {
    gateway_url: 'test',
    org_dn: '',
    config_path: '',
    project: 'bar',
    auth_type: 'CUSTOM',
    date_format: 'short'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });
  it('should configure CUSTOM', async () => {
    const otdsOptions: MyConfigSchema = {
      auth_type: 'CUSTOM',
      project: projectName
    };
    const tree = await schematicRunner.runSchematic('authenticate', otdsOptions, appTree);
    const files = tree.files;
    expect(files).toContain('/projects/bar/src/app/services/auth/authentication.service.ts');
    expect(files).toContain('/projects/bar/src/app/services/auth/auth-guard.service.ts');
    let auth_type = readConfig(tree, '/projects/bar/src', 'AUTH_TYPE')
    expect(auth_type).toEqual('CUSTOM');
    const htmlContent = tree.readContent('/projects/bar/src/app/services/auth/authentication.service.ts');
    expect(htmlContent).toContain("async authenticate");
    expect(htmlContent).toContain("public isAuthenticated(): boolean {");
    expect(htmlContent).not.toContain("import { firstValueFrom } from 'rxjs';");
    expect(htmlContent).not.toContain("private xmlParser = new Parser({");
    expect(htmlContent).not.toContain("async authOTDS");
    expect(htmlContent).not.toContain("async getSAML");
    expect(htmlContent).not.toContain("async authAW");
    expect(htmlContent).not.toContain("interface OTDSTicket");
  });
});
