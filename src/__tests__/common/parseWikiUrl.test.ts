import { parseWikiUrl } from '../../common';

describe('parseWikiUrl', () => {
  it('should be undefined when unknown url', async () => {
    const url = 'https://google.com';
    const parsed = parseWikiUrl(url);
    expect(parsed).toBeUndefined();
  });

  it('should be defined when correct url', async () => {
    const url =
      'https://dev.azure.com/organization/demo-project/_wiki/wikis/demo-project.wiki/1/This-is-a-page';
    const parsed = parseWikiUrl(url);
    expect(parsed).toBeDefined();
    expect(parsed?.id).toEqual(1);
    expect(parsed?.path).toEqual('This-is-a-page');
    expect(parsed?.name).toEqual('demo-project.wiki');
  });

  it('should be undefined when unknown id', async () => {
    const url =
      'https://dev.azure.com/organization/demo-project/_wiki/wikis/demo-project.wiki/some-id/This-is-a-page';
    const parsed = parseWikiUrl(url);
    expect(parsed).toBeUndefined();
  });
});
