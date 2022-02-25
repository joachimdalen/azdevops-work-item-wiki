import { ErrorBoundary } from '@joachimdalen/azdevops-ext-core/ErrorBoundary';
import { LoadingSection } from '@joachimdalen/azdevops-ext-core/LoadingSection';
import { useBooleanToggle } from '@joachimdalen/azdevops-ext-core/useBooleanToggle';
import { useResizeTimeout } from '@joachimdalen/azdevops-ext-core/useResizeTimeout';
import { WebLogger } from '@joachimdalen/azdevops-ext-core/WebLogger';
import {
  IWorkItemChangedArgs,
  IWorkItemNotificationListener
} from 'azure-devops-extension-api/WorkItemTracking';
import * as DevOps from 'azure-devops-extension-sdk';
import { ZeroData } from 'azure-devops-ui/ZeroData';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ElementContent } from 'react-markdown/lib/ast-to-react';
import gfm from 'remark-gfm';

import WikiService from '../common/services/WikiService';

interface WitInputs {
  wikiUrl: string;
}

const WorkItemWikiControl = (): JSX.Element => {
  const [content, setContent] = useState<string | undefined>();
  const [loading, toggle] = useBooleanToggle(true);
  useResizeTimeout(5000);
  const [wikiService] = useMemo(() => [new WikiService()], []);

  const provider = useMemo(() => {
    const listener: Partial<IWorkItemNotificationListener> = {
      onRefreshed: async function (refreshEventArgs: IWorkItemChangedArgs): Promise<void> {
        await loadWikiPage();
      }
    };
    return listener;
  }, []);

  async function loadWikiPage() {
    toggle(true);
    const config: WitInputs = DevOps.getConfiguration().witInputs;
    const content = await wikiService.loadWikiPage(config.wikiUrl);
    if (content) {
      setContent(content);
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
        WebLogger.debug('Loading work item control...');
        await DevOps.ready();
        DevOps.register(DevOps.getContributionId(), provider);

        await loadWikiPage();

        await DevOps.notifyLoadSucceeded();
        DevOps.resize();
      } catch (error) {
        WebLogger.error('Failed to get project configuration', error);
        await DevOps.notifyLoadFailed('Failed to load');
      } finally {
        toggle(false);
      }
    }

    initModule();
  }, []);

  const transformImageUrls = (src: string, alt: string, title: string | null): string => {
    return wikiService.transformAttachmentUrl(src);
  };

  const transformLinkUri = (
    href: string,
    children: Array<ElementContent>,
    title: string | null
  ) => {
    return wikiService.transformAttachmentUrl(href);
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
