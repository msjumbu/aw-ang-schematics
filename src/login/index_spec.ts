import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createTestApp } from '../utils/create-test-app';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { ConfigSchema as MyConfigSchema } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('login', () => {
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
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });

  it('should create files', async () => {
    const loginOptions: MyConfigSchema = {
      name: '',
      project: projectName,
    };
    const tree = await schematicRunner.runSchematic('login', loginOptions, appTree);

    expect(tree.files).toContain('/projects/bar/src/app/login/login.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/login/login.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/login/login.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/login/login.component.ts');
  });
});

describe('login with clarity', () => {
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
    ui_framework: 'clarity'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });

  it('html should be modified for clarity', async () => {
    const loginOptions: MyConfigSchema = {
      name: '',
      project: projectName,
    };
    const tree = await schematicRunner.runSchematic('login', loginOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/login/login.component.html');
    expect(htmlContent).not.toContain('mat-card');
    expect(htmlContent).toContain('login-wrapper');
    expect(htmlContent).toContain('clr-input-container');
    expect(htmlContent).toContain('clr-password-container');
  });
});

describe('login with material', () => {
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
    ui_framework: 'material'
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });

  it('html should be modified for clarity', async () => {
    const loginOptions: MyConfigSchema = {
      name: '',
      project: projectName,
    };
    const tree = await schematicRunner.runSchematic('login', loginOptions, appTree);
    const htmlContent = tree.readContent('/projects/bar/src/app/login/login.component.html');
    expect(htmlContent).toContain('mat-card');
    expect(htmlContent).toContain('mat-card-content');
    expect(htmlContent).toContain('mat-form-field');
    expect(htmlContent).not.toContain('login-wrapper');
    expect(htmlContent).not.toContain('clr-input-container');
    expect(htmlContent).not.toContain('clr-password-container');
  });
});
