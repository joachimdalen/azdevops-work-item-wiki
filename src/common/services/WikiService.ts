import {
  ExtendedWikiRestClient,
  WikiPageMeta
} from '@joachimdalen/azdevops-ext-core/ExtendedWikiRestClient';
import { WebLogger } from '@joachimdalen/azdevops-ext-core/WebLogger';
import { getClient } from 'azure-devops-extension-api';
import { GitRestClient, VersionControlRecursionType } from 'azure-devops-extension-api/Git';
import { WikiRestClient, WikiV2 } from 'azure-devops-extension-api/Wiki';
import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking';
import * as DevOps from 'azure-devops-extension-sdk';
import path from 'path';

import { IWikiPage, WikiControlConfiguration } from '../../wi-control/types';
import { parseProjectName } from '../parseProjectName';
import { parseWikiUrl } from '../parseWikiUrl';

export enum WikiResultCode {
  ParseFailure = 0,
  FailedToResolve = 1,
  FailedToFindContent = 2,
  UnknownFailure = 3,
  Success = 4
}
export interface WikiResult {
  meta?: WikiPageMeta;
  result: WikiResultCode;
}

interface IWikiService {
  loadWikiPage(options: WikiControlConfiguration): Promise<WikiResult>;
  transformAttachmentUrl(url: string, rootPath: string, branchName?: string): string;
}
class WikiService implements IWikiService {
  private _gitClient: GitRestClient;
  private _wikiClient: WikiRestClient;
  private _extWikiClient: ExtendedWikiRestClient;
  private _wikiRepoUrl?: string;

  constructor() {
    this._wikiClient = getClient(WikiRestClient);
    this._gitClient = getClient(GitRestClient);
    this._extWikiClient = getClient(ExtendedWikiRestClient);
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

  public async tryGetWiki(wikiName: string, project: string): Promise<WikiV2 | undefined> {
    try {
      const wikiDef = await this._wikiClient.getWiki(wikiName, project);
      return wikiDef;
    } catch {
      return undefined;
    }
  }

  public async loadWikiPage(options: WikiControlConfiguration): Promise<WikiResult> {
    const wiki: IWikiPage | undefined = parseWikiUrl(options.wikiUrl);
    if (wiki === undefined)
      return {
        result: WikiResultCode.ParseFailure
      };

    let wikiDef = undefined;
    let projectName = parseProjectName(options.wikiUrl);

    if (projectName !== undefined) {
      wikiDef = await this.tryGetWiki(wiki.name, projectName);
    }

    if (wikiDef === undefined && wiki.projectName !== undefined) {
      wikiDef = await this.tryGetWiki(wiki.name, wiki.projectName);

      if (wikiDef === undefined && wiki.projectName.indexOf('-') > 0) {
        const spaceProject = wiki.projectName.replace(/-/g, ' ');
        wikiDef = await this.tryGetWiki(wiki.name, spaceProject);
        projectName = spaceProject;
      }
    }

    if (wikiDef === undefined) {
      const project = await this.getProjectForWorkItem();
      if (project !== undefined) {
        wikiDef = await this.tryGetWiki(wiki.name, project);
        projectName = project;
      }
    }

    if (wikiDef === undefined || projectName === undefined) {
      return {
        result: WikiResultCode.FailedToResolve
      };
    }

    try {
      const wikiRepo = await this._gitClient.getRepository(wikiDef.repositoryId, projectName);
      this.setBaseUrl(wikiRepo.url);
    } catch (error) {
      this.setBaseUrl('');
      WebLogger.warning('Failed to resolve repository for wiki');
    }

    try {
      const wikiMeta = await this._extWikiClient.getPageMetadata(
        projectName,
        wiki.name,
        wiki.id,
        VersionControlRecursionType.Full,
        true
      );

      return {
        result: WikiResultCode.Success,
        meta: wikiMeta
      };
    } catch (error) {
      WebLogger.error(error);
      return {
        result: WikiResultCode.FailedToFindContent
      };
    }
  }

  public setBaseUrl(url: string): void {
    this._wikiRepoUrl = url;
  }

  public transformAttachmentUrl(url: string, rootPath: string, branchName?: string): string {
    if (this._wikiRepoUrl === undefined) {
      return url;
    }

    const resolved = path.resolve(path.dirname(rootPath), url);

    const fullRepoUrl = `${
      this._wikiRepoUrl
    }/Items?path=${resolved}&download=false&resolveLfs=true&$format=octetStream&api-version=5.0-preview.1&sanitize=true&versionDescriptor.version=${
      branchName || 'wikiMaster'
    }`;

    return fullRepoUrl;
  }
}

export default WikiService;
