import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { buildRelativePath } from "@schematics/angular/utility/find-module";
import { ConfigSchema as ServiceSchema } from './schema';
import { TypesGenerator } from './types-generator';
import { WsdlService } from './wsdl.service';
import { IDefinition, IPortType } from './IWSDL';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function service(options: ServiceSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    // const host = createHost(tree);
    const workspace = await getWorkspace(tree);
    // const { workspace } = await workspaces.readWorkspace('/', host);
    const project = workspace.projects.get(options.project as string);
    if (!project) {
      throw new SchematicsException(`Project "${options.project}" does not exist.`);
    }
    // const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }
    options.root = `${project.root}`
    options.sourceRoot = `${project.sourceRoot}`;
    const movePath = normalize(options.path + '/services/');
    if (!options.wsdl_url || options.wsdl_url == 'test') {
      // _options.wsdl_url = 'http://10.96.75.123:81/home/PTP/com.eibus.web.tools.wsdl.WSDLGateway.wcp?service=http%3A%2F%2Fschemas.cordys.com%2FUserManagement%2F1.0%2FUser%2F*&version=isv&resolveexternals=true';
      options.wsdl_url = 'http://10.96.75.123:81/home/PTP/com.eibus.web.tools.wsdl.WSDLGateway.wcp?service=http%3A%2F%2Fschemas.cordys.com%2Fsalesorderdatabasemetadata%2FGetScmSoSalesDistrictPriceMasterObject&resolveexternals=true';
      // options.wsdl_url = 'http://10.96.75.123:81/home/PTP/com.eibus.web.tools.wsdl.WSDLGateway.wcp?service=http%3A%2F%2Fschemas.cordys.com%2FUserManagement%2F1.0%2FUser%2FGetOrganizationsOfUser&resolveexternals=true';
    }
    if (options.wsdl_url.indexOf('resolveexternals=true') < 0) {
      options.wsdl_url += "&resolveexternals=true";
    }
    let wsdlService: WsdlService = new WsdlService();
    let def: IDefinition = await wsdlService.getWSDL(options.wsdl_url);
    
    let s = [];
    let pts = def.portTypes;
    if (pts.length != 1) {
      throw new SchematicsException(`WSDL contains no method or more than one method`);
    }
    // let typeFileName = dasherize(def.name.startsWith('Method_Set_') ? def.name.substring('Method_Set_'.length) : def.name) + '.types';
    if (options.skipService) {
      return chain([createTypes(def, movePath)])
    }
    for (let index = 0; index < pts.length; index++) {
      const pt = pts[index];
      if (pt.operation?.length != 1) {
        throw new SchematicsException(`WSDL contains no method or more than one method`);
      }
      s.push(createService(def, pt, movePath, options))
    }
    return chain([createTypes(def, movePath), ...s])
  };
}

function createTypes(def: IDefinition, filePath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    let typesGen: TypesGenerator = new TypesGenerator();
    const res = typesGen.generateTypes(def);
    let inMsg = def.portTypes[0].operation?.[0].input?.name;
    inMsg = def.messages.find(msg => msg.name == inMsg)?.element[0]?.name ?? inMsg;
    if (!inMsg) throw new Error("Why?");
    
    const file = normalize(filePath + '/' + dasherize(inMsg) + '.types.ts');
    console.log(file.toString());
    
    if (tree.exists(file))
      tree.overwrite(file, res);
    else
      tree.create(file, res);
    return tree;
  }
}

function createService(def: IDefinition, pt: IPortType, filePath: string, _options: ServiceSchema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let inMsg = pt.operation?.[0].input?.name;
    let outMsg = pt.operation?.[0].output?.name;
    inMsg = def.messages.find(msg => msg.name == inMsg)?.element[0]?.name ?? inMsg;
    outMsg = def.messages.find(msg => msg.name == outMsg)?.element[0]?.name ?? outMsg;
    if (!inMsg) throw new SchematicsException('Service name not available.');
    let t = url('./files');

    let srPath = buildRelativePath(`/${filePath}/${dasherize(inMsg)}.service.ts`, normalize(`/${_options.root}/${_options.sourceRoot}/app/services`));
    let crPath = buildRelativePath(`/${filePath}/${dasherize(inMsg)}.service.ts`, normalize(`/${_options.root}/${_options.sourceRoot}/app/config`));
    const typeFileName = dasherize(inMsg) + '.types';
    const templateSource = apply(t, [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: inMsg,
        inMsg: 'I' + inMsg,
        outMsg: 'I' + outMsg,
        typesFile: typeFileName,
        srPath: srPath,
        crPath: crPath,
        webServiceName: inMsg,
        webServiceNS: pt.operation?.[0].ns?.ns,
        webServiceResponse: pt.operation?.[0].output?.element[0].name,
        auth_type: "AW"
      }),
      move(normalize(filePath as string)),
    ]);
    return mergeWith(templateSource, MergeStrategy.AllowCreationConflict);
  }
}