import { messages } from '../messages';
import { getLogger } from '../helpers/logger';
import { ScopeMap, Scopes } from '../types';
import { buildTranslationFile, FileAction } from './buildTranslationFile';
import { buildScopeFilePaths } from '../helpers/buildScopeFilePaths';

type Params = {
  scopeToKeys: ScopeMap;
  langs: string[];
  outputPath: string;
  replace: boolean;
  scopes: Scopes;
};

export function createTranslationFiles({ scopeToKeys, langs, outputPath, replace, scopes }: Params) {
  const logger = getLogger();

  const scopeFiles = buildScopeFilePaths({ aliasToScope: scopes.aliasToScope, langs, outputPath });
  const globalFiles = langs.map(lang => ({ path: `${outputPath}/${lang}.json` }));
  const actions: FileAction[] = [];

  for (const { path } of globalFiles) {
    actions.push(buildTranslationFile(path, scopeToKeys.__global, replace));
  }

  for (const { path, scope } of scopeFiles) {
    actions.push(buildTranslationFile(path, scopeToKeys[scope], replace));
  }

  const newFiles = actions.filter(action => action.type === 'new');

  if (newFiles.length) {
    logger.success(`${messages.creatingFiles} 🗂`);
    logger.log(newFiles.map(action => action.path).join('\n'));
  }

  logger.log(`\n              🌵 ${messages.done} 🌵`);
}
