import {
  DevOpsService,
  ErrorBoundary,
  LoadingSection,
  useBooleanToggle,
  useResizeTimeout,
  webLogger
} from '@joachimdalen/azdevops-ext-core';
import { getClient } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git';
import { VersionControlRecursionType } from 'azure-devops-extension-api/Git/Git';
import { WikiRestClient } from 'azure-devops-extension-api/Wiki';
import * as DevOps from 'azure-devops-extension-sdk';
import { ZeroData } from 'azure-devops-ui/ZeroData';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ElementContent } from 'react-markdown/lib/ast-to-react';
import gfm from 'remark-gfm';

import { IWikiPage, parseWikiUrl } from '../common';
import WorkItemListener from './WorkItemListener';

interface WitInputs {
  wikiUrl: string;
}

const WorkItemWikiControl = (): JSX.Element => {
  const [content, setContent] = useState<string | undefined>();
  const [repoUrl, setRepoUrl] = useState<string | undefined>();
  const [loading, toggle] = useBooleanToggle(true);
  useResizeTimeout(5000);
  const [wikiClient, gitClient, devOpsService] = useMemo(() => {
    const wikiClient = getClient(WikiRestClient);
    const gitClient = getClient(GitRestClient);
    return [wikiClient, gitClient, new DevOpsService()];
  }, []);

  async function loadWikiPage() {
    toggle(true);
    const config: WitInputs = DevOps.getConfiguration().witInputs;
    const wiki: IWikiPage | undefined = parseWikiUrl(config.wikiUrl);

    if (wiki !== undefined) {
      const project = await devOpsService.getProject();
      if (project) {
        const wikiDef = await wikiClient.getWiki(wiki.name, project.id);
        const wikiRepo = await gitClient.getRepository(wikiDef.repositoryId, project.name);
        setRepoUrl(wikiRepo.url);
        const wikiContent = await wikiClient.getPageByIdText(
          project.name,
          wiki.name,
          wiki.id,
          VersionControlRecursionType.Full,
          true
        );
        setContent(wikiContent);
      }
    }
    toggle(false);
  }

  useEffect(() => {
    async function initModule() {
      try {
        await DevOps.init({
          loaded: false,
          applyTheme: true
        });
        webLogger.debug('Loading work item control...');
        await DevOps.ready();
        DevOps.register(DevOps.getContributionId(), new WorkItemListener());

        await loadWikiPage();

        await DevOps.notifyLoadSucceeded();
        DevOps.resize();
      } catch (error) {
        webLogger.error('Failed to get project configuration', error);
        await DevOps.notifyLoadFailed('Failed to load');
      } finally {
        toggle(false);
      }
    }

    initModule();
  }, []);
  const transformAttachmentUrl = (url: string) => {
    if (!url.startsWith('/.attachments')) {
      return url;
    }
    const fullRepoUrl = `${repoUrl}/Items?path=${url}&download=false&resolveLfs=true&$format=octetStream&api-version=5.0-preview.1&sanitize=true&versionDescriptor.version=wikiMaster`;
    return fullRepoUrl;
  };
  const transformImageUrls = (src: string, alt: string, title: string | null): string => {
    return transformAttachmentUrl(src);
  };

  const transformLinkUri = (
    href: string,
    children: Array<ElementContent>,
    title: string | null
  ) => {
    return transformAttachmentUrl(href);
  };

  if (loading) {
    return (
      <div className="flex-column flex-grow">
        <LoadingSection text="Loading Wiki" isLoading={loading} />
      </div>
    );
  }

  if (content === undefined)
    return (
      <ZeroData
        imageAltText={''}
        iconProps={{ iconName: 'Page' }}
        primaryText="Wiki Not Found"
        secondaryText="Failed to resolve Wiki page. Ensure the configured url is correct and that the wiki page exists"
      />
    );

  return (
    <ErrorBoundary>
      <div className="flex-column flex-grow">
        <div className="padding-8  rendered-markdown-content">
          <ReactMarkdown
            remarkPlugins={[gfm]}
            transformImageUri={transformImageUrls}
            transformLinkUri={transformLinkUri}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default WorkItemWikiControl;
