import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  Tree,
  url
} from '@angular-devkit/schematics';
import { normalize, virtualFs, workspaces } from '@angular-devkit/core';
import { ConfigSchema as MyServiceSchema } from './schema';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { InsertChange } from '@schematics/angular/utility/change';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function appWorks(_options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);
    
    const project = (_options.project != null) ? workspace.projects.get(_options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${_options.project}`);
    }

    // const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
    if (_options.path === undefined) {
      _options.path = `${project.sourceRoot}`;
      _options.root = `${project.root}`
    }
    const movePath = normalize(_options.path + '/');
    
    let t = url('./files/src');
    console.log(t.toString())
    const templateSource = apply(t, [
      applyTemplates({ ..._options }),
      move(movePath)
    ]);
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      addImportToNgModule(_options)
    ]);
  };
}

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

function addImportToNgModule(_options: MyServiceSchema): Rule {
  return (tree: Tree) => {
    const modulePath = `/${_options.root}/src/app/app.module.ts`;
    const sourceText = tree.read(modulePath);
    if (!sourceText) {
      throw new SchematicsException(`Could not find file for path: ${modulePath}`);
    }
    const source = ts.createSourceFile(modulePath, sourceText.toString(), ts.ScriptTarget.Latest, true);

    const changes = addImportToModule(
      source,
      modulePath,
      'HttpClientModule',
      '@angular/common/http'
    );

    const recorder = tree.beginUpdate(modulePath);
    changes.forEach(change => {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    });
    tree.commitUpdate(recorder);

    return tree;
  };
}

