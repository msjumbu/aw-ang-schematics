import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  schematic,
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

export function appWorks(options: AWSchema): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);
    let s: Rule | undefined = undefined;
    if (options.auth_type == 'OTDS') {
      s = schematic('auth-otds', {});
    } else if (options.auth_type = 'AW') {
      s = schematic('auth-aw', {});
    }
    if (!s) throw new SchematicsException('Auth type not selected');
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }
    
    // TODO: See if there is any other way
    if (options.ui_framework == 'clarity') {
      const angularJson = tree.read('/angular.json');
      if (!angularJson) throw new SchematicsException('Unable to find angular.json');
      const initialWorkspace = JSON.parse(angularJson.toString('utf-8'));
      let style = initialWorkspace.projects[options.project ?? 0].architect.build.options.styles.find((item: string) => item == "node_modules/@clr/ui/clr-ui.min.css");
      if (!style)
        initialWorkspace.projects[options.project ?? 0].architect.build.options.styles.splice(0, 0, "node_modules/@clr/ui/clr-ui.min.css")
      tree.overwrite('/angular.json', JSON.stringify(initialWorkspace, undefined, 2));
    }

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}`;
    }
    options.root = `${project.root}`
    options.sourceRoot = `${project.sourceRoot}`;

    if (!tree.exists(`./angular.json`))
      throw new SchematicsException(`angular.json file not found, are you sure you are running it from angular workspace?`);

    const movePath = normalize(options.sourceRoot + '/');

    let t = url('./files/src');
    const templateSource = apply(t, [
      applyTemplates({ ...options }),
      move(movePath)
    ]);
    let rules: Rule[] = [
      mergeWith(templateSource, MergeStrategy.Overwrite),
      addImportToNgModule(options),
      s];
    if (!options.ui_framework || options.ui_framework.toLowerCase() == 'material') {
      const matSource = apply(url('./files/material'), [
        applyTemplates({ ...options }),
        move(movePath)
      ]);
      rules.push(mergeWith(matSource, MergeStrategy.Overwrite));
    }
    return chain(rules);
  };
}

function addImportToNgModule(options: AWSchema): Rule {
  return (tree: Tree) => {
    if (!options.gateway_url) throw new SchematicsException('AppWorks Gateway URL is required');
    // const modulePath = `/${_options.root}/${_options.sourceRoot}/app/app.module.ts`;
    const modulePath = `/${options.sourceRoot}/app/app.module.ts`;
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
    if (options.ui_framework == 'material') {
      changes = changes.concat(addImportToModule(
        source,
        modulePath,
        'MaterialModule',
        './modules/material.module'
      ));
    }
    if (options.ui_framework == 'clarity') {
      changes = changes.concat(addImportToModule(
        source,
        modulePath,
        'ClarityModule',
        '@clr/angular'
      ));
    }
    addImport('APP_INITIALIZER', '@angular/core');
    addImport('HttpClient', '@angular/common/http');
    // addImport('HTTP_INTERCEPTORS', '@angular/common/http');
    addImport('Observable', 'rxjs');
    addImport('tap', 'rxjs');
    addImport('Config', './config/config.service');
    addImport('ConfigService', './config/config.service');
    // addImport('AuthenticationService', './services/authentication.service');

    const providerChanges = addSymbolToNgModuleMetadata(source,
      modulePath,
      'providers',
      '{ provide: APP_INITIALIZER, useFactory: initializeAppFactory, deps: [HttpClient, ConfigService], multi: true }',
      null);
    changes = changes.concat(providerChanges);
    // changes = changes.concat(addSymbolToNgModuleMetadata(source,
    //   modulePath,
    //   'providers',
    //   '{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, deps: [AuthenticationService], multi: true }',
    //   null));
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
  return () => httpClient.get<Config>('${options.config_path || 'assets/config.json'}')
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
