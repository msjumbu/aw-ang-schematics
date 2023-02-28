import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { setConfig } from '../utils/util';
import { ConfigSchema as OTDSAuthSchema } from './schema';
import * as inquirer from "inquirer";

export function authentication(options: OTDSAuthSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const questions = [
      {
        type: 'input',
        name: 'otdsurl',
        message: "Please enter your OTDS authentication rest service URL.",
      }];
    if (!options.auth_type) options.auth_type = 'OTDS';

    if (options.auth_type == 'OTDS' && !options.otds_url) {
      if (isTTY()) {
        const prompt = inquirer.createPromptModule();
        let t = await prompt(questions);
        options.otds_url = t['otdsurl'];
      }
      if (!options.otds_url)
        throw new SchematicsException('OTDS URL is required for OTDS authentication');
    }

    const workspace = await getWorkspace(tree);
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }
    if (options.path === undefined) {
      options.path = `${project.sourceRoot}`;
    }
    options.root = `${project.root}`
    options.sourceRoot = `${project.sourceRoot}`;

    const movePath = normalize(options.sourceRoot + '/');
    let t = url('./files/src');
    setConfig(tree, options.sourceRoot, 'AUTH_TYPE', options.auth_type, true);
    if (options.auth_type == 'OTDS' && options.otds_url)
      setConfig(tree, options.sourceRoot, 'OTDS_URL', options.otds_url, true);

    const templateSource = apply(t, [
      applyTemplates({ ...options }),
      move(movePath)
    ]);
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite)]);
  };
}

function _isTruthy(value: undefined | string): boolean {
  // Returns true if value is a string that is anything but 0 or false.
  return value !== undefined && value !== '0' && value.toUpperCase() !== 'FALSE';
}

function isTTY(): boolean {
  // If we force TTY, we always return true.
  const force = process.env['NG_FORCE_TTY'];
  if (force !== undefined) {
    return _isTruthy(force);
  }

  return !!process.stdout.isTTY && !_isTruthy(process.env['CI']);
}
