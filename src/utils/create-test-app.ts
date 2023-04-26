import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as ModuleOptions } from '@schematics/angular/module/schema';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

export async function createTestApp(projectName: string, testRunner: SchematicTestRunner): Promise<UnitTestTree> {
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };
  const appOptions: ApplicationOptions = {
    name: projectName,
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    skipPackageJson: false,
  };

  let appTree: UnitTestTree;
  appTree = await testRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
  appTree = await testRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
  return appTree;
}

export async function createTestModule(projectName: string, moduleName: string,
  testRunner: SchematicTestRunner, appTree: UnitTestTree): Promise<UnitTestTree> {
  const moduleOptions: ModuleOptions = {
    name: moduleName,
    project: projectName
  };

  appTree = await testRunner.runExternalSchematic('@schematics/angular', 'module', moduleOptions, appTree);
  return appTree;
}

