import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, strings, Tree, url } from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";
import { parseName } from '@schematics/angular/utility/parse-name';
import { ConfigSchema as LoginSchema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function login(options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(options.project as string);
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
      { "name": options.name, "path": options.path }),
    customizeComponent(options)]);
  };
}

function customizeComponent(options: LoginSchema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let t = url('./files');
    let path = options.path;

    if (!path) {
      throw new SchematicsException(`Path "${options.path}" does not exist.`);
    }
    const templateSource = apply(t, [
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
    return mergeWith(templateSource, MergeStrategy.Overwrite);

  }
}