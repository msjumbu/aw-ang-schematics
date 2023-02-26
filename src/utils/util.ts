import { normalize } from "@angular-devkit/core";
import { SchematicsException, Tree } from "@angular-devkit/schematics";

export function readConfig(tree: Tree, sourceRoot: string, prop:string) : string | undefined | null {
    let s = tree.read(normalize(sourceRoot + '/assets/config.json'))?.toString('utf-8');
    if (!s) throw new SchematicsException('Unable to find/read config.json');
    let config = JSON.parse(s);
    if (!config) throw new SchematicsException('Unable to parse config.json');
    return (config[prop]);
}

export function setConfig(tree: Tree, sourceRoot: string, prop:string, value: string, overwrite: boolean) : string | undefined | null {
    let s = tree.read(normalize(sourceRoot + '/assets/config.json'))?.toString('utf-8');
    if (!s) throw new SchematicsException('Unable to find/read config.json');
    let config = JSON.parse(s);
    if (!config) throw new SchematicsException('Unable to parse config.json');
    if (config[prop] && config[prop] != value && !overwrite) throw new SchematicsException(prop + ' is already configured with different value ' + value);
    config[prop] = value;
    tree.overwrite(normalize(sourceRoot + '/assets/config.json'), JSON.stringify(config, undefined, 2));
    return (config[prop]);
}