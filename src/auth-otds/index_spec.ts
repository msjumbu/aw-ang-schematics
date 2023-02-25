import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { ConfigSchema as MyConfigSchema } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('OTDS Authentication', () => {

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
  describe('OTDS Authentication', () => {

    const appOptions: ApplicationOptions = {
      name: 'bar',
      inlineStyle: false,
      inlineTemplate: false,
      routing: true,
      skipPackageJson: false,
    };
    const awOptions: AWSchema = {
      gateway_url: 'test',
      org_dn: '',
      config_path: '',
      project: 'bar',
      auth_type: 'OTDS',
    };

    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await testRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions)
      appTree = await testRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
      appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
    });
    it('should configure OTDS support', async () => {
      const otdsOptions: MyConfigSchema = {
        otds_url: 'rest'
      };
      // const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await schematicRunner.runSchematic('auth-otds', otdsOptions, appTree);

      expect(tree.files).not.toEqual([]);
    });
  });
})