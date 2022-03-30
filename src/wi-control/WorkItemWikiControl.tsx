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

import WikiService, { WikiResult, WikiResultCode } from '../common/services/WikiService';
import { WikiControlConfiguration } from './types';
interface WikiResultText {
  title: string;
  description: string;
}

const getResult = (result?: WikiResult): WikiResultText | undefined => {
  if (result === undefined) {
    return {
      title: 'Unknwon failure',
      description:
        'An unknown failure happened. Please check the browser console for errors and submit an issue'
    };
  }
  switch (result.result) {
    case WikiResultCode.ParseFailure: {
      return {
        title: 'Failed to parse url',
        description: 'Failed to parse the provided wiki url. Ensure it is correctly configured'
      };
    }
    case WikiResultCode.FailedToResolve: {
      return {
        title: 'Failed to resolve project',
        description:
          'Failed to resolve the project for the wiki. Please specify the project in control options'
      };
    }
    case WikiResultCode.FailedToFindContent: {
      return {
        title: 'Failed to find content',
        description:
          'Failed to find any content for the provided wiki page. Ensure the page exists and that it has content'
      };
    }
    case WikiResultCode.UnknownFailure: {
      return {
        title: 'Unknwon failure',
        description:
          'An unknown failure happened. Please check the browser console for errors and submit an issue'
      };
    }
  }
};

const WorkItemWikiControl = (): JSX.Element => {
  const [result, setResult] = useState<WikiResult>();
  const [loading, toggle] = useBooleanToggle(true);
  const [config, setConfig] = useState<WikiControlConfiguration>();
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
    const wiConfig: WikiControlConfiguration = DevOps.getConfiguration().witInputs;
    setConfig(wiConfig);
    if (wiConfig !== undefined) {
      const loadResult: WikiResult = await wikiService.loadWikiPage(wiConfig);
      setResult(loadResult);
    } else {
      setResult({ result: WikiResultCode.ParseFailure });
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
    return wikiService.transformAttachmentUrl(
      src,
      result?.meta?.gitItemPath || '',
      config?.versionBranch
    );
  };

  const transformLinkUri = (
    href: string,
    children: Array<ElementContent>,
    title: string | null
  ) => {
    if (href.startsWith('http')) {
      return href;
    }

    return wikiService.transformAttachmentUrl(
      href,
      result?.meta?.gitItemPath || '',
      config?.versionBranch
    );
  };

  if (loading) {
    return (
      <div className="flex-column flex-grow">
        <LoadingSection text="Loading Wiki" isLoading={loading} />
      </div>
    );
  }

  if (result?.result !== WikiResultCode.Success) {
    const details = getResult(result);
    return (
      <ZeroData
        imageAltText={''}
        iconProps={{ iconName: 'Page' }}
        primaryText={details?.title}
        secondaryText={details?.description}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex-column flex-grow">
        <div className="padding-8  rendered-markdown-content">
          <ReactMarkdown
            remarkPlugins={[gfm]}
            transformImageUri={transformImageUrls}
            transformLinkUri={transformLinkUri}
            components={{
              a: props => (
                <a href={props.href} rel="noopener noreferrer" target="_blank">
                  {props.children}
                </a>
              )
            }}
          >
            {result?.meta?.content || 'No content'}
          </ReactMarkdown>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default WorkItemWikiControl;
