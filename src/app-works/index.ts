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
import { normalize } from '@angular-devkit/core';
import { ConfigSchema as AWSchema } from './schema';
import { addImportToModule, addSymbolToNgModuleMetadata, findNodes, insertAfterLastOccurrence, insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/workspace';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function appWorks(_options: AWSchema): Rule {
  return async (tree: Tree) => {
    // const host = createHost(tree);
    // const { workspace } = await workspaces.readWorkspace('/', host);
    const workspace = await getWorkspace(tree);
    const project = (_options.project != null) ? workspace.projects.get(_options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${_options.project}`);
    }
    // TODO: See if there is any other way
    const angularJson = tree.read('/angular.json');
    if (!angularJson) throw new SchematicsException('Unable to find angular.json');
    const initialWorkspace = JSON.parse(angularJson.toString('utf-8'));
    initialWorkspace.projects[_options.project ?? 0].architect.build.options.styles.splice(0, 0, "node_modules/@clr/ui/clr-ui.min.css")
    tree.overwrite('/angular.json', JSON.stringify(initialWorkspace));

    if (_options.path === undefined) {
      _options.path = `${project.sourceRoot}`;
    }
    _options.root = `${project.root}`
    _options.sourceRoot = `${project.sourceRoot}`;

    if (!tree.exists(`./angular.json`))
      throw new SchematicsException(`angular.json file not found, are you sure you are running it from angular workspace?`);

    const movePath = normalize(_options.sourceRoot + '/');

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

// function createHost(tree: Tree): workspaces.WorkspaceHost {
//   return {
//     async readFile(path: string): Promise<string> {
//       const data = tree.read(path);
//       if (!data) {
//         throw new SchematicsException('File not found.');
//       }
//       return virtualFs.fileBufferToString(data);
//     },
//     async writeFile(path: string, data: string): Promise<void> {
//       return tree.overwrite(path, data);
//     },
//     async isDirectory(path: string): Promise<boolean> {
//       return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
//     },
//     async isFile(path: string): Promise<boolean> {
//       return tree.exists(path);
//     },
//   };
// }

function addImportToNgModule(_options: AWSchema): Rule {
  return (tree: Tree) => {
    if (!_options.gateway_url) throw new SchematicsException('AppWorks Gateway URL is required');
    // const modulePath = `/${_options.root}/${_options.sourceRoot}/app/app.module.ts`;
    const modulePath = `/${_options.sourceRoot}/app/app.module.ts`;
    const sourceText = tree.read(modulePath);
    if (!sourceText) {
      throw new SchematicsException(`Could not find file for path: ${modulePath}`);
    }
    const source = ts.createSourceFile(modulePath, sourceText.toString(), ts.ScriptTarget.Latest, true);

    let changes = addImportToModule(
      source,
      modulePath,
      'HttpClientModule',
      '@angular/common/http'
    );
    changes = changes.concat(addImportToModule(
      source,
      modulePath,
      'ReactiveFormsModule',
      '@angular/forms'
    ));
    changes = changes.concat(addImportToModule(
      source,
      modulePath,
      'BrowserAnimationsModule',
      '@angular/platform-browser/animations'
    ));
    changes = changes.concat(addImportToModule(
      source,
      modulePath,
      'ClarityModule',
      '@clr/angular'
    ));

    addImport('APP_INITIALIZER', '@angular/core');
    addImport('HttpClient', '@angular/common/http');
    addImport('Observable', 'rxjs');
    addImport('tap', 'rxjs');
    addImport('Config', './config/config.service');
    addImport('ConfigService', './config/config.service');

    const providerChanges = addSymbolToNgModuleMetadata(source,
      modulePath,
      'providers',
      '{ provide: APP_INITIALIZER, useFactory: initializeAppFactory, deps: [HttpClient, ConfigService], multi: true }',
      null);
    changes = changes.concat(providerChanges);

    addAppInitializerFactory();

    const recorder = tree.beginUpdate(modulePath);
    changes.forEach(change => {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    });
    tree.commitUpdate(recorder);

    return tree;

    function addAppInitializerFactory() {
      let initializeAppFactory = `

function initializeAppFactory(httpClient: HttpClient, configService: ConfigService): () => Observable<any> {
  // Replace this path, if the config file location is changed
  return () => httpClient.get<Config>('${_options.config_path || 'assets/config.json'}')
    .pipe(
       tap(config => { 
          configService.config = config;
        })
    );
 }
 `;
      let chk = findNodes(source, ts.SyntaxKind.Identifier);
      let initFactoryFound = false;
      for (let index = 0; index < chk.length; index++) {
        const element = chk[index];
        if (element.parent.kind == ts.SyntaxKind.FunctionDeclaration && element.getText() == 'initializeAppFactory') {
          initFactoryFound = true;
          break;
        }
      }
      if (!initFactoryFound) {
        let t = findNodes(source, ts.SyntaxKind.ClassDeclaration);
        let c = insertAfterLastOccurrence(t, initializeAppFactory, modulePath, 0);
        changes = changes.concat(c);
      }
    }

    function addImport(symbolName: string, fileName: string) {
      if (!isImported(source, symbolName, fileName)) {
        const importAppInit = insertImport(
          source,
          modulePath,
          symbolName,
          fileName
        );
        changes = changes.concat(importAppInit);
      }
    }
  };
}

