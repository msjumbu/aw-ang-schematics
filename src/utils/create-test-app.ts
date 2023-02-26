import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

export async function createTestApp(projectName: string, testRunner: SchematicTestRunner) : Promise<UnitTestTree>{
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
  
  