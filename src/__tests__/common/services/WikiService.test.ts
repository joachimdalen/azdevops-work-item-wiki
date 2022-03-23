import { IProjectInfo } from 'azure-devops-extension-api';
import { GitRepository } from 'azure-devops-extension-api/Git';
import { WikiV2 } from 'azure-devops-extension-api/Wiki';

import { mockGetRepository } from '../../../__mocks__/azure-devops-extension-api/Git';
import {
  mockGetPageByIdText,
  mockGetWiki
} from '../../../__mocks__/azure-devops-extension-api/Wiki';
import { mockGetFieldValue, mockGetProject } from '../../../__mocks__/azure-devops-extension-sdk';
import WikiService, { WikiResultCode } from '../../../common/services/WikiService';
jest.mock('azure-devops-extension-api');
describe('WikiService', () => {
  const validUrl =
    'https://dev.azure.com/organization/demo-project/_wiki/wikis/demo-project.wiki/1/This-is-a-page';
  const invalidUrl = 'https://google.com';
  const project: IProjectInfo = {
    id: '5395360b-3cb4-456c-acb8-b2107d72395e',
    name: 'demo-project'
  };
  describe('loadWikiPage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return undefined when unknown url', async () => {
      const service = new WikiService();
      const result = await service.loadWikiPage(invalidUrl);
      expect(result.content).toBeUndefined();
      expect(result.result).toEqual(WikiResultCode.ParseFailure);
    });

    it('should return undefined when failing to get project', async () => {
      mockGetProject.mockResolvedValue(undefined);
      const service = new WikiService();
      const result = await service.loadWikiPage(validUrl);
      expect(result.content).toBeUndefined();
      expect(result.result).toEqual(WikiResultCode.FailedToResolve);
    });

    it('should return content', async () => {
      mockGetFieldValue.mockResolvedValue(project.name);
      const wiki: Partial<WikiV2> = {
        id: 'demo-project.wiki',
        name: 'Demo project wiki',
        repositoryId: '50752e85-abae-48a2-b509-7ecaed38f640'
      };
      const repo: Partial<GitRepository> = {
        url: 'https://git.localhost.test'
      };
      mockGetWiki.mockResolvedValue(wiki);
      mockGetRepository.mockResolvedValue(repo);
      mockGetPageByIdText.mockResolvedValue('### Hello');

      const service = new WikiService();
      const result = await service.loadWikiPage(validUrl);
      expect(mockGetWiki).toHaveBeenCalledWith('demo-project.wiki', project.name);
      expect(mockGetRepository).toHaveBeenCalledWith(wiki.repositoryId, project.name);
      expect(result.content).toEqual('### Hello');
      expect(result.result).toEqual(WikiResultCode.Success);
    });
  });

  describe('transformAttachmentUrl', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should passed url when base is not set', async () => {
      const service = new WikiService();
      expect(service.transformAttachmentUrl('/.attachments/path')).toEqual('/.attachments/path');
    });
    it('should passed url when passed is not attachment', async () => {
      const service = new WikiService();
      expect(service.transformAttachmentUrl('/.some/path')).toEqual('/.some/path');
    });
    it('should return full url when valid', async () => {
      const service = new WikiService();
      const base = 'https://repo.localhost.text';
      service.setBaseUrl(base);
      const attachment = '/.attachments/file.txt';
      expect(service.transformAttachmentUrl(attachment)).toEqual(
        `${base}/Items?path=${attachment}&download=false&resolveLfs=true&$format=octetStream&api-version=5.0-preview.1&sanitize=true&versionDescriptor.version=wikiMaster`
      );
    });
  });
});
