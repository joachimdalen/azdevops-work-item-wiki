import { webLogger } from '@joachimdalen/azdevops-ext-core';
import { getClient } from 'azure-devops-extension-api';
import { VersionControlRecursionType } from 'azure-devops-extension-api/Git/Git';
import { WikiRestClient } from 'azure-devops-extension-api/Wiki';
import * as DevOps from 'azure-devops-extension-sdk';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import WorkItemListener from './WorkItemListener';

interface WitInputs {
  wikiUrl: string;
}

const parseWikiUrl = (url: string) => {
  const expression = /_wiki\/wikis\/(?<wikiName>.+)\/(?<wikiId>\d)\/(?<wikiPath>.+)/gm;
  let m;

  while ((m = expression.exec(url)) !== null) {
    if (m.index === expression.lastIndex) {
      expression.lastIndex++;
    }

    const wikiName = m.groups?.wikiName?.trim();
    const wikiId = m.groups?.wikiId?.trim();
    const wikiPath = m.groups?.wikiPath?.trim();
    if (wikiId === undefined || wikiName === undefined || wikiPath === undefined) {
      return undefined;
    }

    const wikiIdNum = parseInt(wikiId);
    if (isNaN(wikiIdNum)) {
      return undefined;
    }

    return {
      wikiName,
      wikiId: wikiIdNum,
      wikiPath
    };
  }

  return undefined;
};

const WorkItemWikiControl = (): JSX.Element => {
  const [content, setContent] = useState<string | undefined>();
  const wikiClient = useMemo(() => {
    const client = getClient(WikiRestClient);
    return client;
    // [Some wiki page](/Some-wiki-page)
  }, []);

  useEffect(() => {
    async function initModule() {
      try {
        await DevOps.init({
          loaded: false,
          applyTheme: true
        });
        webLogger.information('Loading work item control...');
        await DevOps.ready();
        DevOps.register(DevOps.getContributionId(), new WorkItemListener());

        const config: WitInputs = DevOps.getConfiguration().witInputs;
        console.log(config);

        const wiki = parseWikiUrl(config.wikiUrl);
        console.log(wiki);

        // const wikis = await wikiClient.getPageText(
        //   'demo-project-basic',
        //   'demo-project-basic.wiki',
        //   '/Some wiki page',
        //   VersionControlRecursionType.Full
        // );

        if (wiki !== undefined) {
          const wikis = await wikiClient.getPageByIdText(
            'demo-project-basic',
            wiki.wikiName,
            wiki.wikiId
          );

          //[Some wiki page](/Some-wiki-page)
          console.log(wikis);
          setContent(wikis);
          //console.log(JSON.parse(wikis));
        }

        await DevOps.notifyLoadSucceeded();
        DevOps.resize();
      } catch (error) {
        webLogger.error('Failed to get project configuration', error);
        //   await DevOps.notifyLoadFailed('Failed to load');
      }
    }

    initModule();
  }, []);

  if (content === undefined) return <div>Noop</div>;

  return (
    <div>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default WorkItemWikiControl;
