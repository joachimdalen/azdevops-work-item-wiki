<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/joachimdalen/azdevops-work-item-wiki">
    <img src="extension-icon.png" alt="Logo" width="100" height="100">
  </a>

<h3 align="center">Work Item Wiki</h3>

  <p align="center">
    Add static wiki pages to your work items
    <br />
    <a href="https://docs.devops-extensions.dev/docs/extensions/work-item-wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://marketplace.visualstudio.com/items?itemName=joachimdalen.work-item-wiki">View Extension</a>
    ·
    <a href="https://github.com/joachimdalen/azdevops-work-item-wiki/blob/master/CHANGELOG.md">Changelog</a>
    ·
    <a href="https://github.com/joachimdalen/azdevops-work-item-wiki/issues">Report Bug</a>
    ·
    <a href="https://github.com/joachimdalen/azdevops-work-item-wiki/issues">Request Feature</a>
  </p>
</div>

<div align="center">
  <img alt="Azure DevOps builds" src="https://img.shields.io/azure-devops/build/dalenapps/6531387f-baea-443c-a284-0d0e786e56c3/45?color=0078d7&label=Master%20Build&logo=azure-devops&style=flat-square">
  <img alt="Issues" src="https://img.shields.io/github/issues/joachimdalen/azdevops-work-item-wiki.svg?style=flat-square">
  <img alt="License" src="https://img.shields.io/github/license/joachimdalen/azdevops-work-item-wiki?style=flat-square">
</div>
<div align="center">

  <img alt="Visual Studio Marketplace Installs - Azure DevOps Extension" src="https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/joachimdalen.work-item-wiki?label=Marketplace%20Installs&style=flat-square">
  <img alt="Visual Studio Marketplace Last Updated" src="https://img.shields.io/visual-studio-marketplace/last-updated/joachimdalen.work-item-wiki?style=flat-square">
<img alt="Visual Studio Marketplace Rating" src="https://img.shields.io/visual-studio-marketplace/r/joachimdalen.work-item-wiki?style=flat-square">
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#limitations">Limitations</a><li>   
      </ul>
    </li>
    <li><a href="#post-install-configuration">Post Install Configuration</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#release-and-merge-strategy">Release and merge strategy</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

---

## About The Project

Work item wiki is a control to render a wikipage inside a work item page. This can be useful if you need to document something for that work item type. For example definition of done/ready, bug categories etc.

Example where rendered on custom page:

![Product Name Screen Shot][product-screenshot]

### Supported Wiki Features

| Feature             | Supported         |
| ------------------- | ----------------- |
| Header (H1, H2, H3) | ✅                |
| Italic              | ✅                |
| Bold                | ✅                |
| Link                | ✅                |
| Attachment          | ✅                |
| Image               | ✅                |
| Code / Code Block   | ✅                |
| Unordered list      | ✅                |
| Ordered list        | ✅                |
| Table               | ✅                |
| Mermaid Diagram     | ❌                |
| Work Item Mentions  | ❌                |
| Table of Contents   | ❌                |
| Formulas            | ❌                |
| Mention             | ❌                |
| Query Results       | ❌                |
| Task List           | ❌ (Display only) |

<p align="right">(<a href="#top">back to top</a>)</p>

## Post Install Configuration

Work Item Link is a custom form control that needs to be added to the Work Item Form. It can be added on an existing page, or as a new tab. For how to do this, refer to the [official documentation](https://docs.microsoft.com/en-us/azure/devops/organizations/settings/work/custom-controls-process?view=azure-devops#add-a-field-level-contribution-or-custom-control).

- `Wiki Url` is the url to the wiki page, it should look something like: `https://dev.azure.com/organization/demo-project/_wiki/wikis/demo-project.wiki/1/This-is-a-page`
- `Version Branch` is used when publishing the wiki from code. If your main branch is not `wikiMaster`, this field must be set to load links, images and attachments correctly.

| ![Config one][config-one] | ![Config one][config-two] |
| ------------------------- | ------------------------- |

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- A MarketPlace publisher [Create a publisher](https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops#create-a-publisher)
- `tfx-cli` installed. Due to issues with outdated dependencies this is not included in `package.json`

  ```sh
  npm install -g tfx-cli
  ```

- Pipelines uses the following extensions that needs to be installed in your organization in addition to default tasks:
  - [GitGuard](https://marketplace.visualstudio.com/items?itemName=joachimdalen.gitguard) - Used to verify changes to files, such as changelog.
  - [Azure DevOps Extension Tasks](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.vsts-developer-tools-build-tasks) - Used to build and publish extension.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/joachimdalen/azdevops-work-item-wiki.git
   ```

2. Install dependencies

   ```sh
   > npm install
   ```

3. Update publisher in `vss-extension.dev.json`
4. Compile development version

   ```sh
   npm run prepare:dev
   ```

5. [Publish extension](https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops#publish-an-extension)
6. [Share](https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops#share-an-extension) and [install](https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops#install-an-extension) extension
7. Run extension

   ```sh
   npm run serve:dev
   ```

   **Note:** You might need to open [https://localhost:3000/](https://localhost:3000/) in your browser from time to time to accept the unsecure certificate to have the extension load properly from your local environment.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

See [documenation](https://docs.devops-extensions.dev/docs/extensions/work-item-wiki).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/joachimdalen/azdevops-work-item-wiki/issues?q=is%3Aopen+is%3Aissue+label%3A%40type%2Ffeature) for a full list of proposed features.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are welcome, both in the form of suggestions and code. Create

If you want to contribute code, I ask that you follow some guidelines.

- New and changed features should to the best ability be covered by tests
- Follow the branching policy:
  - `feature/` for new features
  - `bugfix/` for bug fixes
  - `docs/` for documentation changes
- If your change is related to an issue, use the id as the first part of the branch e.g `bugfix/12-fix-crash-when-updating-rule`
- Pull requests should target the `develop` branch

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/123-some-feature`)
3. Commit your Changes (`git commit -m 'Add some feature'`)
4. Push to the Branch (`git push origin feature/123-some-feature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## Release and merge strategy

- `master` is only deployed to `PROD` and tagged with `v<extension_version>`
  - Pull requests are always squash merged into `master`
  - `master` is the only branch where GitHub releases are created for
- `feature/*` and `bugfix/*` are deployed to `QA`. For deployment to `DEV` using local assets (only manifest changes are deployed to dev), the `Deploy to DEV instead of QA` option needs to be checked when running the deployment pipeline.

`QA` and `DEV` are private development and verfication environments (publications of the extensions.) Submit a new issue if you for some reason wish access to either of these.

**Note** Access to these are not given for your local development. Please publish your own development release.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

If you have generic questions about the project or usage you can make contact in the following ways:

- Submit an issue with the `@type/question` label - [New Issue](https://github.com/joachimdalen/azdevops-work-item-wiki/issues/new)
- Submit a new question under the [Marketplace Q&A section](https://marketplace.visualstudio.com/items?itemName=joachimdalen.work-item-wiki&ssr=false#qna).

<p align="right">(<a href="#top">back to top</a>)</p>

[product-screenshot]: marketplace/docs/images/bug-example.png
[config-one]: marketplace/docs/images/control-config-1.png
[config-two]: marketplace/docs/images/control-config-2.png
