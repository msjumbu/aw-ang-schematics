import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { buildRelativePath } from "@schematics/angular/utility/find-module";
import { ConfigSchema as MyServiceSchema } from './schema';
import { TypesGenerator } from './types-generator';
import { WsdlService } from './wsdl.service';
import { IDefinition, IPortType } from './IWSDL';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function service(_options: MyServiceSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    // const host = createHost(tree);
    const workspace = await getWorkspace(tree);
    // const { workspace } = await workspaces.readWorkspace('/', host);
      const project = workspace.projects.get(_options.project as string);
      if (!project) {
        throw new SchematicsException(`Project "${_options.project}" does not exist.`);
      }
      // const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
    if (_options.path === undefined) {
      _options.path = buildDefaultPath(project);
    }
    _options.root = `${project.root}`
    _options.sourceRoot = `${project.sourceRoot}`;
    const movePath = normalize(_options.path + '/services/');
    if (!_options.wsdl_url || _options.wsdl_url == 'test') {
      // let wsdlURL = 'http://10.96.75.123:81/home/PTP/com.eibus.web.tools.wsdl.WSDLGateway.wcp?service=http%3A%2F%2Fschemas.cordys.com%2FUserManagement%2F1.0%2FUser%2F*&version=isv&resolveexternals=true';
      _options.wsdl_url = 'http://10.96.75.123:81/home/PTP/com.eibus.web.tools.wsdl.WSDLGateway.wcp?service=http%3A%2F%2Fschemas.cordys.com%2Fsalesorderdatabasemetadata%2FGetScmSoSalesDistrictPriceMasterObjects&resolveexternals=true';
    }
    let wsdlService: WsdlService = new WsdlService();
    let def: IDefinition = await wsdlService.getWSDL(_options.wsdl_url);
    let s = [];
    let pts = def.portTypes;
    if (pts.length != 1) {
      throw new SchematicsException(`WSDL contains no method or more than one method`);
    }
    let typeFileName = dasherize(def.name.startsWith('Method_Set_') ? def.name.substring('Method_Set_'.length) : def.name) + '.types';
    for (let index = 0; index < pts.length; index++) {
      const pt = pts[index];
      s.push(createService(def, pt, movePath, typeFileName, _options))
    }
    return chain([createTypes(def, movePath, typeFileName), ...s])
  };
}

function createTypes(def: IDefinition, filePath: string, typeFileName: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    let typesGen: TypesGenerator = new TypesGenerator();
    const res = typesGen.generateTypes(def);
    const file = normalize(filePath + '/' + typeFileName + '.ts');
    if (tree.exists(file))
      tree.overwrite(file, res);
    else
      tree.create(file, res);
    return tree;
  }
}

function createService(def: IDefinition, pt: IPortType, filePath: string, typeFileName: string, _options: MyServiceSchema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const serviceName = pt.operation?.name;
    let inMsg = pt.operation?.input?.name;
    let outMsg = pt.operation?.output?.name;
    inMsg = def.messages.find(msg => msg.name == inMsg)?.element[0]?.name ?? inMsg;
    outMsg = def.messages.find(msg => msg.name == outMsg)?.element[0]?.name ?? outMsg;
  if (!serviceName) throw new SchematicsException('Service name not available.');
    let t = url('./files');

    let srPath = buildRelativePath(`/${filePath}/${dasherize(serviceName)}.service.ts`, normalize(`/${_options.root}/${_options.sourceRoot}/app/services`));
    let crPath = buildRelativePath(`/${filePath}/${dasherize(serviceName)}.service.ts`, normalize(`/${_options.root}/${_options.sourceRoot}/app/config`));

    const templateSource = apply(t, [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: serviceName,
        inMsg: 'I' + inMsg,
        outMsg: 'I' + outMsg,
        typesFile: typeFileName,
        srPath: srPath,
        crPath: crPath
      }),
      move(normalize(filePath as string)),
    ]);
    return mergeWith(templateSource, MergeStrategy.AllowCreationConflict);
  }
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
