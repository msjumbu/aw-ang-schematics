import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
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
    let s = tree.read(normalize(options.sourceRoot + '/assets/config.json'))?.toString('utf-8');
    if (!s) throw new SchematicsException('Unable to find/read config.json');
    let config = JSON.parse(s);
    if (!config) throw new SchematicsException('Unable to parse config.json');
    if (config['AUTH_TYPE']) throw new SchematicsException('Authentication is already configured');
    config['AUTH_TYPE'] = 'AW';
    tree.overwrite(normalize(options.sourceRoot + '/assets/config.json'), JSON.stringify(config));

    const templateSource = apply(t, [
      applyTemplates({ ...options }),
      move(movePath)
    ]);
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite)]);
  };
}

