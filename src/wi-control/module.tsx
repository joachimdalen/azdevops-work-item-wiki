/* istanbul ignore file */

import './index.scss';

import { ErrorBoundary } from '@joachimdalen/azdevops-ext-core/ErrorBoundary';
import { showRootComponent } from '@joachimdalen/azdevops-ext-core/showRootComponent';

import WorkItemWikiControl from './WorkItemWikiControl';

const App = () => {
  return (
    <ErrorBoundary>
      <WorkItemWikiControl />
    </ErrorBoundary>
  );
};
showRootComponent(<App />, 'wi-control-container');
