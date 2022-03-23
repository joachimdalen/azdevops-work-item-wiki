import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import { mockGetConfiguration } from '../../__mocks__/azure-devops-extension-sdk';
import WikiService, { WikiResultCode } from '../../common/services/WikiService';
import WorkItemWikiControl from '../../wi-control/WorkItemWikiControl';

jest.mock('azure-devops-extension-api');
const validUrl =
  'https://dev.azure.com/organization/demo-project/_wiki/wikis/demo-project.wiki/1/This-is-a-page';

describe('WorkItemWikiControl', () => {
  const loadWikiSpy = jest.spyOn(WikiService.prototype, 'loadWikiPage');
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loader while waiting', async () => {
    loadWikiSpy.mockResolvedValue({
      result: WikiResultCode.Success,
      content: 'Hello'
    });
    mockGetConfiguration.mockReturnValue({
      witInputs: {
        wikiUrl: validUrl
      }
    });
    render(<WorkItemWikiControl />);
    await screen.findAllByText(/Loading Wiki/);
  });
  it('should show zero if no content loaded', async () => {
    loadWikiSpy.mockResolvedValue({
      result: WikiResultCode.FailedToFindContent,
      content: 'Hello'
    });
    mockGetConfiguration.mockReturnValue({
      witInputs: {
        wikiUrl: validUrl
      }
    });
    render(<WorkItemWikiControl />);
    await screen.findAllByText(/Failed to find content/);
  });

  it('should load content', async () => {
    loadWikiSpy.mockResolvedValue({
      result: WikiResultCode.Success,
      content: '### Hello'
    });
    mockGetConfiguration.mockReturnValue({
      witInputs: {
        wikiUrl: validUrl
      }
    });
    render(<WorkItemWikiControl />);
    await screen.findAllByText(/### Hello/);
  });
});
