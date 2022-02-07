import { DevOpsService, IDevOpsService } from '@joachimdalen/azdevops-ext-core';
import { getClient } from 'azure-devops-extension-api';
import { GitRestClient, VersionControlRecursionType } from 'azure-devops-extension-api/Git';
import { WikiRestClient } from 'azure-devops-extension-api/Wiki';

import { IWikiPage, parseWikiUrl } from '..';

interface IWikiService {
  loadWikiPage(url: string): Promise<string | undefined>;
  transformAttachmentUrl(url: string): string;
}
class WikiService implements IWikiService {
  private _gitClient: GitRestClient;
  private _wikiClient: WikiRestClient;
  private _devOpsService: IDevOpsService;
  private _wikiRepoUrl?: string;

  constructor() {
    this._wikiClient = getClient(WikiRestClient);
    this._gitClient = getClient(GitRestClient);
    this._devOpsService = new DevOpsService();
  }

  public async loadWikiPage(url: string): Promise<string | undefined> {
    const wiki: IWikiPage | undefined = parseWikiUrl(url);
    if (wiki === undefined) return;

    const project = await this._devOpsService.getProject();
    if (project === undefined) return;

    const wikiDef = await this._wikiClient.getWiki(wiki.name, project.id);

    const wikiRepo = await this._gitClient.getRepository(wikiDef.repositoryId, project.name);
    this._wikiRepoUrl = wikiRepo.url;

    const wikiContent = await this._wikiClient.getPageByIdText(
      project.name,
      wiki.name,
      wiki.id,
      VersionControlRecursionType.Full,
      true
    );
    return wikiContent;
  }

  public transformAttachmentUrl(url: string): string {
    if (!url.startsWith('/.attachments') || this._wikiRepoUrl === undefined) {
      return url;
    }
    const fullRepoUrl = `${this._wikiRepoUrl}/Items?path=${url}&download=false&resolveLfs=true&$format=octetStream&api-version=5.0-preview.1&sanitize=true&versionDescriptor.version=wikiMaster`;
    return fullRepoUrl;
  }
}

export default WikiService;
