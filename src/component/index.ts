import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, noop, Rule, schematic, SchematicContext, SchematicsException, strings, Tree, url } from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";
import { ConfigSchema as ComponentSchema } from './schema';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { addImportToModule, findNode, findNodes } from '@schematics/angular/utility/ast-utils';
import { parseName } from '@schematics/angular/utility/parse-name';
import { readConfig } from '../utils/util';
import { buildRelativePath, findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { normalize, Path } from '@angular-devkit/core';
import { InsertChange } from '@schematics/angular/utility/change';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(options: ComponentSchema): Rule {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Project "${options.project}" does not exist.`);
    }
    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }
    let mod: Path | undefined;
    if (options.module) {
      mod = findModuleFromOptions(host, {
        name: options.module,
        path: options.path
      });
      if (!mod) throw new SchematicsException(`Module not found.`);
      options.path = mod.substring(0, mod.lastIndexOf('/'));
    } else {
      options.module = '';
    }
    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    options.root = `${project.root}`
    options.sourceRoot = `${project.sourceRoot}`;
    options.selector =
      options.selector || buildSelector(options.name, (project && project.prefix) || '');

    return chain([externalSchematic('@schematics/angular', 'component',
      // { "name": options.name, "path": options.path, "project": options.project}
      { "name": options.name, "project": options.project, "path": options.path, "module": options.module }
    ),
    schematic('service',
      { "wsdl_url": options.wsdl_url, "path": options.path + '/' + dasherize(options.name), "project": options.project }),
    createComponent(options),
    addImportsToModule(mod, options.sourceRoot)]);
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

function addImportsToModule(modulePath: Path | undefined, sourceRoot: string): Rule {
  if (!modulePath) {
    return noop;
  }
  return (tree: Tree, _context: SchematicContext) => {
    const sourceText = tree.read(modulePath);
    if (!sourceText) {
      throw new SchematicsException(`Could not find file for path: ${modulePath}`);
    }
    let ui_framework = readConfig(tree, sourceRoot, 'UI_FRAMEWORK');
    const source = ts.createSourceFile(modulePath, sourceText.toString(), ts.ScriptTarget.Latest, true);
    let mPath = buildRelativePath(`${modulePath}`, normalize(`/${sourceRoot}/app/modules`));
    // console.log("M ==> " + `${modulePath}`);
    // console.log("M ==> " + `/${sourceRoot}/app/modules`);
    // console.log("M ==> " + mPath);
    let changes = addImportToModule(
      source,
      modulePath,
      'ReactiveFormsModule',
      '@angular/forms'
    );
    if (ui_framework == 'material') {
      changes = changes.concat(addImportToModule(
        source,
        modulePath,
        'MaterialModule',
        `${mPath}/material.module`
      ));
    }
    if (ui_framework == 'primeng') {
      changes = changes.concat(addImportToModule(
        source,
        modulePath,
        'PrimeNGModule',
        `${mPath}/primeng.module`
      ));
    }
    if (ui_framework == 'clarity') {
      changes = changes.concat(addImportToModule(
        source,
        modulePath,
        'ClarityModule',
        '@clr/angular'
      ));
    }
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

function createComponent(options: ComponentSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!options.sourceRoot) throw new SchematicsException('Source Root not set');
    let uiFramework = readConfig(tree, options.sourceRoot, 'UI_FRAMEWORK');
    let t = url('./files/material');
    if (uiFramework && uiFramework.toLowerCase() == 'clarity'.toLowerCase())
      t = url('./files/clarity');
    if (uiFramework && uiFramework.toLowerCase() == 'primeng'.toLowerCase())
      t = url('./files/primeng');
    let path = options.path;

    if (!path) {
      throw new SchematicsException(`Path "${options.path}" does not exist.`);
    }

    let crPath = buildRelativePath(`/${path}/${dasherize(options.name)}/${dasherize(options.name)}.component.ts`, normalize(`/${options.sourceRoot}/app/config`));
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

    let outputs: any[] = [];
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
        (tuple.maxOccurs == 'unbounded' || tuple.maxOccurs > 1))
        createGrid = true;
    } else {
      outputs = metadata[1].element;
    }

    let inputs = metadata[0].element ? metadata[0].element.filter((item: { name: string; }) => item.name != 'cursor') : undefined;
    const tsComponentSource = apply(url('./files/common'), [
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
        tableName: tableName,
        crPath: crPath,
        uiFramework: uiFramework
      }),
      move(path)
    ]);
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
        tableName: tableName,
        crPath: crPath,
        uiFramework: uiFramework
      }),
      move(path)
    ]);
    return chain([
      mergeWith(tsComponentSource, MergeStrategy.Overwrite),
      mergeWith(templateSource, MergeStrategy.Overwrite)]);
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

