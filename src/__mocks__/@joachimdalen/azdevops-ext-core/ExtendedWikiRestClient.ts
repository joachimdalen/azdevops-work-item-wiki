import { IVssRestClientOptions } from 'azure-devops-extension-api';
import { VersionControlRecursionType } from 'azure-devops-extension-api/Git';
export interface WikiPageMeta {
  path: string;
  order: number;
  gitItemPath: string;
  subPages: any[];
  url: string;
  remoteUrl: string;
  id: number;
  content: string;
}

export const mockGetPageMetadata = jest.fn().mockRejectedValue(new Error('Not implemented'));

export class ExtendedWikiRestClient {
  public TYPE = 'ExtendedWikiRestClient';
  constructor(options: IVssRestClientOptions) {}

  public async getPageMetadata(
    project: string,
    wikiIdentifier: string,
    id: number,
    recursionLevel?: VersionControlRecursionType,
    includeContent?: boolean
  ): Promise<WikiPageMeta> {
    return new Promise(resolve =>
      resolve(mockGetPageMetadata(project, wikiIdentifier, id, recursionLevel, includeContent))
    );
  }
}
