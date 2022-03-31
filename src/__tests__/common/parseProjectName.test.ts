import { parseProjectName } from '../../common/parseProjectName';

describe('parseProjectName', () => {
  it('should be undefined when unknown url', async () => {
    const url = 'https://google.com';
    const parsed = parseProjectName(url);
    expect(parsed).toBeUndefined();
  });

  it('should be defined when correct legacy domain', async () => {
    const url =
      'https://organization.visualstudio.com/demo-project/_wiki/wikis/demo-project.wiki/1/This-is-a-page';
    const parsed = parseProjectName(url);
    expect(parsed).toEqual('demo-project');
  });

  it('should be defined when correct domain', async () => {
    const url =
      'https://dev.azure.com/organization/demo-project/_wiki/wikis/demo-project.wiki/some-id/This-is-a-page';
    const parsed = parseProjectName(url);
    expect(parsed).toEqual('demo-project');
  });
  it('should be defined when correct project with space', async () => {
    const url =
      'https://dev.azure.com/organization/demo%20project/_wiki/wikis/demo-project.wiki/some-id/This-is-a-page';
    const parsed = parseProjectName(url);
    expect(parsed).toEqual('demo project');
  });
});
