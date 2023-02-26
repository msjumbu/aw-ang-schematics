import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ConfigSchema as MyServiceSchema } from './schema';

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { wsdl } from "./test/test.wsdls";
import { createTestApp } from '../utils/create-test-app';

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
  describe('with project bar', () => {
    let appTree: UnitTestTree;
    beforeEach(async () => {
      appTree = await createTestApp(projectName, testRunner);
    });
    it('works', async () => {
      
      const defaultOptions: MyServiceSchema = {
        wsdl_url: 'testing&resolveexternals=true',
        path: '/projects/bar/src/app/test',
        project: 'bar',
        skipService: false
      };
      mock.onGet(defaultOptions.wsdl_url).reply(200, wsdl);
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematic('service', defaultOptions, appTree);
      const files = tree.files;
      expect(files).toContain('/projects/bar/src/app/test/services/get-scm-so-sales-district-price-master-objects.types.ts');
      expect(files).toContain('/projects/bar/src/app/test/services/get-scm-so-sales-district-price-master-objects.service.ts');
    });
  });
});
