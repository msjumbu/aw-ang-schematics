import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ConfigSchema as MyConfigSchema } from './schema';
import { createTestApp } from '../utils/create-test-app';
import { readConfig } from '../utils/util';

const collectionPath = path.join(__dirname, '../collection.json');

describe('app-works', () => {

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);

  const projectName = 'bar';
  describe('with core functionality', () => {
    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await createTestApp(projectName, testRunner);
    });
    const defaultOptions: MyConfigSchema = {
      gateway_url: 'test',
      org_dn: '',
      config_path: '',
      project: 'bar',
      auth_type: 'AW',
    };
    it('should create files', async () => {
      const options = { ...defaultOptions };

      const tree = await schematicRunner.runSchematic('app-works', options, appTree);
      const files = tree.files;
      expect(files).toEqual(
        jasmine.arrayContaining([
          '/projects/bar/src/assets/config.json',
          '/projects/bar/src/app/config/config.service.ts',
          '/projects/bar/src/app/services/authentication.service.ts',
          '/projects/bar/src/app/services/utils.ts',
        ]),
      );
    });
    it('should import modules & configure app.module', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner.runSchematic('app-works', options, appTree);

      const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
      expect(appModuleContent).toContain('HttpClientModule');
      expect(appModuleContent).toContain('ReactiveFormsModule');
      expect(appModuleContent).toContain('Observable');
      expect(appModuleContent).toContain('tap');
      expect(appModuleContent).toContain('Config');
      expect(appModuleContent).toContain('ConfigService');
      expect(appModuleContent).withContext('initializeAppFactory').toContain('function initializeAppFactory(httpClient: HttpClient, configService: ConfigService): () => Observable<any> {');
      expect(appModuleContent).toContain(`{ provide: APP_INITIALIZER, useFactory: initializeAppFactory, deps: [HttpClient, ConfigService], multi: true }`);
    });
  });
  
  describe('with clarity ui', () => {
    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await createTestApp(projectName, testRunner);
    });
    const defaultOptions: MyConfigSchema = {
      gateway_url: 'test',
      org_dn: '',
      config_path: '',
      project: 'bar',
      auth_type: 'AW',
      ui_framework: 'clarity'
    };
    it('should have clarity style', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner.runSchematic('app-works', options, appTree);

      const angularJson = tree.read('/angular.json');
      if (!angularJson) throw new Error("Unexpected error");

      const initialWorkspace = JSON.parse(angularJson.toString('utf-8'));
      let style = initialWorkspace.projects[projectName].architect.build.options.styles[0];
      expect(style).withContext('clarity style must be first').toEqual("node_modules/@clr/ui/clr-ui.min.css");
    });

    it('should have clarity in config', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner.runSchematic('app-works', options, appTree);

      let ui_framework = readConfig(tree, '/projects/bar/src', 'UI_FRAMEWORK');
      expect(ui_framework).toEqual('clarity');
    });

    it('should import clarity module', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner.runSchematic('app-works', options, appTree);

      const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
      expect(appModuleContent).toContain('ClarityModule');
      expect(appModuleContent).not.toContain('MaterialModule');
    });
  });

  describe('with angular material ui', () => {
    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await createTestApp(projectName, testRunner);
    });
    const defaultOptions: MyConfigSchema = {
      gateway_url: 'test',
      org_dn: '',
      config_path: '',
      project: 'bar',
      auth_type: 'AW',
      ui_framework: 'material'
    };
    it('should have material in config', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner.runSchematic('app-works', options, appTree);

      let ui_framework = readConfig(tree, '/projects/bar/src', 'UI_FRAMEWORK');
      expect(ui_framework).toEqual('material');
    });

    it('should import material module', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner.runSchematic('app-works', options, appTree);

      const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
      expect(appModuleContent).not.toContain('ClarityModule');
      expect(appModuleContent).toContain('MaterialModule');
    });
  });

});

