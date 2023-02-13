import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('component', () => {
  xit('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('component', {wsdl_url: 'test', name:'pk'}, Tree.empty());

    expect(tree.files).not.toEqual([]);
  });
});
