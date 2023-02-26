import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createTestApp } from '../utils/create-test-app';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { ConfigSchema as MyConfigSchema } from './schema';

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { wsdl } from "./test/test.wsdls";

const collectionPath = path.join(__dirname, '../collection.json');

describe('component', () => {
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
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createTestApp(projectName, testRunner);
    appTree = await schematicRunner.runSchematic('app-works', awOptions, appTree);
  });

  it('works', async () => {
    const compOptions: MyConfigSchema = {
      name: 'pk',
      project: projectName,
      wsdl_url: 'testing&resolveexternals=true',
    };
    mock.onGet(compOptions.wsdl_url).reply(200, wsdl);
    const tree = await schematicRunner.runSchematic('component', compOptions, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.css');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.html');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.spec.ts');
    expect(tree.files).toContain('/projects/bar/src/app/pk/pk.component.ts');

    // expect(tree.files).not.toEqual([]);
  });
});
