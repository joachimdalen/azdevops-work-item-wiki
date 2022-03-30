import { CoreRestClient } from '../Core';
import { ExtendedWikiRestClient } from '../../@joachimdalen/azdevops-ext-core/ExtendedWikiRestClient';
import { GitRestClient } from '../Git';
import { WikiRestClient } from '../Wiki';

export function getClient(clientClass: any) {
  switch (new clientClass().TYPE) {
    case 'CoreRestClient':
      return new CoreRestClient({}) as any;
    case 'WikiRestClient':
      return new WikiRestClient({}) as any;
    case 'GitRestClient':
      return new GitRestClient({}) as any;
    case 'ExtendedWikiRestClient':
      return new ExtendedWikiRestClient({}) as any;
    default:
      throw new Error('Failed to get mock client ' + new clientClass().TYPE + clientClass);
  }
}
