import './index.scss';

import { ErrorBoundary, showRootComponent } from '@joachimdalen/azdevops-ext-core';

import WorkItemWikiControl from './WorkItemWikiControl';

const App = () => {
  return (
    <ErrorBoundary>
      <WorkItemWikiControl />
    </ErrorBoundary>
  );
};
showRootComponent(<App />, 'wi-control-container');
