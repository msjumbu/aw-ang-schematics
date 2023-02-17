import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { ConfigSchema as MyServiceSchema } from './schema';

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { wsdl } from "./test/test.wsdls";

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
    it('works', async () => {
      
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, wsdl);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const files = tree.files;
      expect(files).toContain('/projects/bar/src/app/test/services/salesorder-web-service-interface.types.ts');
      expect(files).toContain('/projects/bar/src/app/test/services/get-scm-so-sales-district-price-master-objects.service.ts');
    });
  });
});
