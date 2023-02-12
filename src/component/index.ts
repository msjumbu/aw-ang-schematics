import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, schematic, SchematicContext, SchematicsException, strings, Tree, url } from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";
import { ConfigSchema as MyServiceSchema } from './schema';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNode, findNodes } from '@schematics/angular/utility/ast-utils';
import { parseName } from '@schematics/angular/utility/parse-name';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(options: MyServiceSchema): Rule {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);
    if (!project) {
      throw new SchematicsException(`Project "${options.project}" does not exist.`);
    }
    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }
    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    console.log(options.path);
    
    options.root = `${project.root}`
    options.sourceRoot = `${project.sourceRoot}`;
    options.selector =
      options.selector || buildSelector(options.name, (project && project.prefix) || '');
    return chain([externalSchematic('@schematics/angular', 'component',
      { "name": options.name, "path": options.path }),
    schematic('service',
      { "wsdl_url": options.wsdl_url, "path": options.path + '/' + dasherize(options.name) }),
    createComponent(options)]);
  };
}

function openSourceFile(filename: string, readSourceText: () => string | undefined) {
  if (filename) {
    const sourceText = readSourceText();

    if (sourceText) {
      return ts.createSourceFile(
        filename,
        sourceText,
        ts.ScriptTarget.Latest,
        true
      ) as ts.SourceFile;
    }
  }
  return null;
}

export function openSourceFileFromTree(tree: Tree, filename: string): ts.SourceFile | null {
  return openSourceFile(filename, () => tree.read(filename)?.toString('utf-8'));
}

function createComponent(options: MyServiceSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    let t = url('./files');
    let path = options.path;

    if (!path) {
      throw new SchematicsException(`Path "${options.path}" does not exist.`);
    }
    let serviceName: string | undefined = '';
    let servicePath, typesPath = '';
    let inMsg, outMsg = '';
    const componentPath = path + '/' + dasherize(options.name);
    tree.getDir(componentPath + '/services')
      .visit((filePath) => {
        let s = openSourceFileFromTree(tree, filePath);
        if (!s)
          throw new SchematicsException('Unable to read the source of the service file ' + filePath);
        if (filePath.endsWith('.service.ts')) {
          let classes = findNodes(s, ts.SyntaxKind.ClassDeclaration);
          for (let index = 0; index < classes.length; index++) {
            const element = classes[index];
            if (!element.modifiers) continue;
            if (!element.modifiers.find(item => item.kind == ts.SyntaxKind.ExportKeyword)) continue;
            serviceName = element.getChildren().find(item => (item.kind == ts.SyntaxKind.Identifier && item.getText().endsWith('Service')))?.getText();
            servicePath = filePath.replace(componentPath, '.').replace(/.ts$/, '');
          }
        }
        if (filePath.endsWith('.types.ts')) {
          let metadataConst = findNode(s, ts.SyntaxKind.Identifier, 'metadata');
          if (!metadataConst) throw new SchematicsException('Unable to get metadata const');
          let metadataValue = findNodes(metadataConst.parent, ts.SyntaxKind.ArrayLiteralExpression);
          if (!metadataValue[0]) throw new SchematicsException('Unable to get metadata ArrayLiteralExpression --> ' + metadataConst);
          let metadata = JSON.parse(metadataValue[0].getText());
          if (!metadata || metadata.length < 2) throw new SchematicsException('Unable to get messages from metadata --> ' + metadataValue[0]);
          inMsg = 'I' + metadata[0].name;
          outMsg = 'I' + metadata[1].name;
          typesPath = filePath.replace(componentPath, '.').replace(/.ts$/, '');
        }
      });

    if (!serviceName) throw new SchematicsException('Unable to get service ' + serviceName);
    const templateSource = apply(t, [
      applyTemplates({
        ...options,
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        serviceName: serviceName,
        servicePath: servicePath,
        inMsg: inMsg,
        outMsg: outMsg,
        typesPath: typesPath,
        type: "component",
        style: "css"
      }),
      move(path)
    ]);
    return mergeWith(templateSource, MergeStrategy.Overwrite);
  }
}

function buildSelector(name: string, prefix: string): any {
  let selector = strings.dasherize(name);
  if (prefix) {
    selector = `${prefix}-${selector}`;
  } else if (prefix === undefined && prefix) {
    selector = `${prefix}-${selector}`;
  }
  return selector;
}
