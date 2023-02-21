import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { ConfigSchema as MyConfigSchema } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('app-works', () => {

  const testRunner = new SchematicTestRunner(
    'rocket',
    require.resolve(collectionPath),
  );
  const schematicRunner = new SchematicTestRunner(
    'msjumbu', collectionPath);

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };
  describe('with project bar', () => {

    const appOptions: ApplicationOptions = {
      name: 'bar',
      inlineStyle: false,
      inlineTemplate: false,
      routing: false,
      skipPackageJson: false,
    };

    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await testRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions)
      appTree = await testRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
    });
    const defaultOptions: MyConfigSchema = {
      gateway_url: 'test',
      org_dn: '',
      config_path: '',
      project: 'bar',
    };
    it('should configure AppWorks support', async () => {
      const options = { ...defaultOptions };

      const tree = await schematicRunner.runSchematic('app-works', options, appTree);
      const files = tree.files;
      expect(files).toEqual(
        jasmine.arrayContaining([
          '/projects/bar/src/assets/config.json',
          '/projects/bar/src/app/config/config.service.ts',
          '/projects/bar/src/app/services/otds.service.ts',
          '/projects/bar/src/app/services/utils.ts',
        ]),
      );
      const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
      // Some random checks on the app.module content, just to make sure its modified
      expect(appModuleContent).toMatch(/import.*HttpClientModule.*from.*'@angular\/common\/http'/);
      expect(appModuleContent).toMatch(/import.*ConfigService.*from.*'.\/config\/config.service'/);
      expect(appModuleContent).toMatch(/imports:\s*\[[^\]]+?,\r?\n\s+HttpClientModule\r?\n/m);
      expect(appModuleContent).toMatch(/provide:.*APP_INITIALIZER/);
      expect(appModuleContent).toMatch('function initializeAppFactory');
    });
  });
});
