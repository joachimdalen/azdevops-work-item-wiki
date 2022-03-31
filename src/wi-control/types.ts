export interface WikiControlConfiguration {
  wikiUrl: string;
  versionBranch?: string;
}

export interface WikiResultText {
  title: string;
  description: string;
}
export interface IWikiPage {
  name: string;
  id: number;
  path: string;
  projectName?: string;
}
