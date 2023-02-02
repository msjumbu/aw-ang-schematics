import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
// import { appWorks } from '../app-works';
import { ConfigSchema as MyServiceSchema } from '../app-works/schema';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { of, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { get } from 'http';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

// Just return the tree
export function ngAdd(_options: MyServiceSchema): Rule {
    return (_tree: Tree, _context: SchematicContext) => {
        return chain([
            addPackageJsonDependencies(),
            installDependencies(),
            setupProject(_options)
        ])(_tree, _context);
    }
}

function addPackageJsonDependencies(): Rule {
    return (tree: Tree, _context: SchematicContext): Observable<Tree> => {        
        return of('xml2js', '@types/xml2js').pipe(
            concatMap(name => getLatestNodeVersion(name)),
            map((npmRegistryPackage: NpmRegistryPackage) => {
                const nodeDependency: NodeDependency = {
                    type: NodeDependencyType.Default,
                    name: npmRegistryPackage.name,
                    version: npmRegistryPackage.version,
                    overwrite: false
                };                
                addPackageJsonDependency(tree, nodeDependency);
                _context.logger.info('✅️ Added dependency');
                return tree;
            })
        );
    };
}

function installDependencies(): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      _context.addTask(new NodePackageInstallTask());
      _context.logger.info('✅️ Dependencies installed');
      return tree;
    };
  }

  function setupProject(options: MyServiceSchema): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      const installTaskId = _context.addTask(new NodePackageInstallTask());
      _context.addTask(new RunSchematicTask('app-works', options), [
        installTaskId
      ]);
      return tree;
    };
  }

export interface NpmRegistryPackage {
    name: string;
    version: string;
}

export function getLatestNodeVersion(
    packageName: string
): Promise<NpmRegistryPackage> {
    const DEFAULT_VERSION = 'latest';

    return new Promise(resolve => {
        return get(`http://registry.npmjs.org/${packageName}`, res => {
            let rawData = '';
            res.on('data', chunk => (rawData += chunk));
            res.on('end', () => {
                try {
                    const response = JSON.parse(rawData);
                    const version = (response && response['dist-tags']) || {};

                    resolve(buildPackage(response.name || packageName, version.latest));
                } catch (e) {
                    resolve(buildPackage(packageName));
                }
            });
        }).on('error', () => resolve(buildPackage(packageName)));
    });

    function buildPackage(
        name: string,
        version: string = DEFAULT_VERSION
    ): NpmRegistryPackage {
        return { name, version };
    }
}