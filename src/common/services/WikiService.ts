import { getClient } from 'azure-devops-extension-api';
import { GitRestClient, VersionControlRecursionType } from 'azure-devops-extension-api/Git';
import { WikiRestClient } from 'azure-devops-extension-api/Wiki';
import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking';
import * as DevOps from 'azure-devops-extension-sdk';

import { IWikiPage, parseWikiUrl } from '..';

interface IWikiService {
  loadWikiPage(url: string): Promise<string | undefined>;
  transformAttachmentUrl(url: string): string;
}
class WikiService implements IWikiService {
  private _gitClient: GitRestClient;
  private _wikiClient: WikiRestClient;
  private _wikiRepoUrl?: string;

  constructor() {
    this._wikiClient = getClient(WikiRestClient);
    this._gitClient = getClient(GitRestClient);
  }

  public async getProjectForWorkItem(): Promise<string | undefined> {
    try {
      const formService = await DevOps.getService<IWorkItemFormService>(
        'ms.vss-work-web.work-item-form'
      );

      const projectName = await formService.getFieldValue('System.TeamProject', {
        returnOriginalValue: true
      });

      return projectName as string;
    } catch {
      return undefined;
    }
  }

  public async loadWikiPage(url: string): Promise<string | undefined> {
    const wiki: IWikiPage | undefined = parseWikiUrl(url);
    if (wiki === undefined) return;

    const project = await this.getProjectForWorkItem();
    if (project === undefined) return;

    const wikiDef = await this._wikiClient.getWiki(wiki.name, project);

    const wikiRepo = await this._gitClient.getRepository(wikiDef.repositoryId, project);
    this.setBaseUrl(wikiRepo.url);

    const wikiContent = await this._wikiClient.getPageByIdText(
      project,
      wiki.name,
      wiki.id,
      VersionControlRecursionType.Full,
      true
    );
    return wikiContent;
  }

  public setBaseUrl(url: string): void {
    this._wikiRepoUrl = url;
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
