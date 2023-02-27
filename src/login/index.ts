import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, strings, Tree, url } from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";
import { parseName } from '@schematics/angular/utility/parse-name';
import { ConfigSchema as LoginSchema } from './schema';
import { readConfig } from '../utils/util';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function login(options: LoginSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Project "${options.project}" does not exist.`);
    }
    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }
    options.name = 'login'
    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    console.log(options.path);

    options.root = `${project.root}`
    options.sourceRoot = `${project.sourceRoot}`;

    return chain([externalSchematic('@schematics/angular', 'component',
      { "name": options.name, "project": options.project }),
    customizeComponent(options)]);
  };
}

function customizeComponent(options: LoginSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    let t = url('./files/common');
    let path = options.path;

    if (!path) {
      throw new SchematicsException(`Path "${options.path}" does not exist.`);
    }
    const commonSource = apply(t, [
      applyTemplates({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        type: "component",
        style: "css",
      }),
      move(path)
    ]);

    if (!options.sourceRoot) throw new SchematicsException('Source Root not set');
    let uiFramework = readConfig(tree, options.sourceRoot, 'UI_FRAMEWORK');
    let u = url('./files/material');
    if (uiFramework && uiFramework.toLowerCase() == 'clarity'.toLowerCase()) {
      u = url('./files/clarity');
    } else if (uiFramework && uiFramework.toLowerCase() == 'primeng'.toLowerCase()) {
      u = url('./files/primeng');
    }
    const compSource = apply(u, [
      applyTemplates({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        type: "component",
        style: "css",
      }),
      move(path)
    ]);

    return chain([mergeWith(commonSource, MergeStrategy.Overwrite),
      mergeWith(compSource, MergeStrategy.Overwrite)]);
  }
}