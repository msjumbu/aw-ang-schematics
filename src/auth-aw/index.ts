import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { setConfig } from '../util';
import { ConfigSchema as AWAuthSchema } from './schema';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function authAw(options: AWAuthSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }
    if (options.path === undefined) {
      options.path = `${project.sourceRoot}`;
    }
    options.root = `${project.root}`
    options.sourceRoot = `${project.sourceRoot}`;
    const movePath = normalize(options.sourceRoot + '/');
    let t = url('./files/src');
    setConfig(tree, options.sourceRoot, 'AUTH_TYPE', 'AW');

    const templateSource = apply(t, [
      applyTemplates({ ...options }),
      move(movePath)
    ]);
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite)]);
  };
}

