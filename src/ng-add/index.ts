import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
// import { appWorks } from '../app-works';
import { ConfigSchema as AWSchema } from '../app-works/schema';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { of, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { get } from 'http';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

// Just return the tree
export function ngAdd(options: AWSchema): Rule {
    return (_tree: Tree, _context: SchematicContext) => {
        return chain([
            addPackageJsonDependencies(options),
            installDependencies(),
            setupProject(options)
        ])(_tree, _context);
    }
}

function addPackageJsonDependencies(options: AWSchema): Rule {
    return (tree: Tree, _context: SchematicContext): Observable<Tree> => {
        let packages = ['xml2js', '@types/xml2js', 'timers', 'stream', '@cds/core'];
        if (options.ui_framework && options.ui_framework.toLowerCase() == 'clarity') {
            packages.push('@clr/angular');
            packages.push('@clr/ui');
        } else if (options.ui_framework && options.ui_framework.toLowerCase() == 'primeng') {
            packages.push('primeng');
            packages.push('primeicons');
            packages.push('primeflex')
        } else {
            packages.push('@angular/material');
        }
        return of(...packages).pipe(
            concatMap(name => getLatestNodeVersion(name)),
            map((npmRegistryPackage: NpmRegistryPackage) => {
                const nodeDependency: NodeDependency = {
                    type: NodeDependencyType.Default,
                    name: npmRegistryPackage.name,
                    version: npmRegistryPackage.version,
                    overwrite: false
                };
                addPackageJsonDependency(tree, nodeDependency);
                _context.logger.info('✅️ Added dependency ' + npmRegistryPackage.name + "@" + npmRegistryPackage.version);
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

function setupProject(options: AWSchema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        const installTaskId = context.addTask(new NodePackageInstallTask());
        if (!options.ui_framework || options.ui_framework.toLowerCase() == 'material') {
            const angMatId = context.addTask(new RunSchematicTask('@angular/material', 'ng-add', undefined), [
                installTaskId
            ]);
            context.addTask(new RunSchematicTask('app-works', options), [
                angMatId
            ]);
        } else {
            context.addTask(new RunSchematicTask('app-works', options), [
                installTaskId
            ]);
        }
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
