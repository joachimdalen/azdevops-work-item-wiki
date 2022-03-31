export const parseProjectName = (url: string): string | undefined => {
  const expression =
    /https:\/\/.+\.visualstudio\.com\/(?<legacyProjectName>.+)\/_wiki\/|https:\/\/dev.azure.com\/.+\/(?<projectName>.+)\/_wiki\//gm;
  let m;

  while ((m = expression.exec(url)) !== null) {
    if (m.index === expression.lastIndex) {
      expression.lastIndex++;
    }

    const legacyName = m.groups?.legacyProjectName?.trim();
    const projectName = m.groups?.projectName?.trim();
    const name = projectName || legacyName;
    return name === undefined ? undefined : decodeURI(name);
  }

  return undefined;
};
