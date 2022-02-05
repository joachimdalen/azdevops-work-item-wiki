import './index.scss';

import { showRootComponent } from '@joachimdalen/azdevops-ext-core';

import WorkItemWikiControl from './WorkItemWikiControl';

const App = () => {
  return <WorkItemWikiControl />;
};
showRootComponent(<App />, 'wi-control-container');
