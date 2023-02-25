import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, schematic, SchematicContext, SchematicsException, strings, Tree, url } from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";
import { ConfigSchema as ComponentSchema } from './schema';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNode, findNodes } from '@schematics/angular/utility/ast-utils';
import { parseName } from '@schematics/angular/utility/parse-name';
import { readConfig } from '../util';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(options: ComponentSchema): Rule {
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
      { "name": options.name, "path": options.path}),
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

function createComponent(options: ComponentSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!options.sourceRoot) throw new SchematicsException('Source Root not set');
    let uiFramework = readConfig(tree, options.sourceRoot, 'UI_FRAMEWORK');
    let t = url('./files/material');
    if (uiFramework && uiFramework.toLowerCase() == 'clarity'.toLowerCase())
      t = url('./files/clarity');
    let path = options.path;

    if (!path) {
      throw new SchematicsException(`Path "${options.path}" does not exist.`);
    }
    let serviceName: string | undefined = '';
    let servicePath, typesPath = '';
    let inMsg, outMsg = '';
    const componentPath = path + '/' + dasherize(options.name);
    let metadata: any[] = [];
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
          metadata = JSON.parse(metadataValue[0].getText());
          if (!metadata || metadata.length < 2) throw new SchematicsException('Unable to get messages from metadata --> ' + metadataValue[0]);
          inMsg = 'I' + metadata[0].name;
          outMsg = 'I' + metadata[1].name;
          typesPath = filePath.replace(componentPath, '.').replace(/.ts$/, '');
        }
      });
    if (!serviceName) throw new SchematicsException('Unable to get service ' + serviceName);
    
    let outputs : any[] = [];
    if (!metadata[1].element) {
      throw new SchematicsException('Service metadata do not contain response element');
    }
    let createGrid = false;
    let useTuple = false;
    let tableName = '';
    let tuple = metadata[1].element.find((item: { name: string; }) => item.name == 'tuple');
    if (tuple) {
      // metadata.tuple.old.table_name.elements
      useTuple = true;
      let old = tuple.element.find((item: { name: string; }) => item.name == 'old');
      if (!old) throw new SchematicsException('Something wrong, tuple found but not old');
      outputs = old.element[0].element;
      tableName = old.element[0].name;
      
      if (tuple.maxOccurs && 
        (tuple.maxOccurs=='unbounded' || tuple.maxOccurs > 1))
        createGrid = true;
    } else {
      outputs = metadata[1].element;
    }
    console.log(metadata[0]);
    
    let inputs = metadata[0].element ? metadata[0].element.filter((item: { name: string; }) => item.name != 'cursor'):undefined;
    const templateSource = apply(t, [
      // options.name ? filter((path) => !path.endsWith('.clr.ts.template')) : noop(),
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
        style: "css",
        inputs: inputs,
        outputs: outputs,
        createGrid: createGrid,
        useTuple: useTuple,
        tableName: tableName
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

