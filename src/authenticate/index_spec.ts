import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { ConfigSchema as MyConfigSchema } from './schema';
import { createTestApp } from '../utils/create-test-app';
import { readConfig } from '../util';

const collectionPath = path.join(__dirname, '../collection.json');

describe('OTDS Authentication', () => {

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
      // auth_type: 'OTDS',
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
      // const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await schematicRunner.runSchematic('authenticate', otdsOptions, appTree);
      const files = tree.files;
      expect(files).toContain('/projects/bar/src/app/services/authentication.service.ts');
      let auth_type = readConfig(tree, '/projects/bar/src', 'AUTH_TYPE');
      expect(auth_type).toEqual('OTDS');
      let otds_url = readConfig(tree, '/projects/bar/src', 'OTDS_URL');
      expect(otds_url).toEqual('rest');
    });
  });

  describe('AW Authentication', () => {
    const awOptions: AWSchema = {
      gateway_url: 'test',
      org_dn: '',
      config_path: '',
      project: 'bar',
      // auth_type: 'OTDS',
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
      // const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await schematicRunner.runSchematic('authenticate', otdsOptions, appTree);
      const files = tree.files;
      expect(files).toContain('/projects/bar/src/app/services/authentication.service.ts');
      let auth_type = readConfig(tree, '/projects/bar/src', 'AUTH_TYPE')
      expect(auth_type).toEqual('AW');
    });
  });
});