export interface IWikiPage {
  name: string;
  id: number;
  path: string;
  projectName?: string;
}

export const parseWikiUrl = (url: string): IWikiPage | undefined => {
  const expression = /_wiki\/wikis\/(?<wikiName>.+)\/(?<wikiId>\d+)\/(?<wikiPath>.+)/gm;
  let m;

  while ((m = expression.exec(url)) !== null) {
    if (m.index === expression.lastIndex) {
      expression.lastIndex++;
    }

    const wikiName = m.groups?.wikiName?.trim();
    const projectNameParts = wikiName?.split('.');
    const projectName =
      projectNameParts !== undefined && projectNameParts?.length > 1
        ? projectNameParts[0]
        : undefined;
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
      projectName: projectName,
      name: wikiName,
      id: wikiIdNum,
      path: wikiPath
    };
  }

  return undefined;
};
