<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Work Item Wiki</h3>

  <p align="center">
Add static wiki pages to your work items
    <br />
    <a href="https://github.com/joachimdalen/azdevops-work-item-wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://marketplace.visualstudio.com/items?itemName=joachimdalen.work-item-wiki">View Extension</a>
    ·
    <a href="https://marketplace.visualstudio.com/items?itemName=joachimdalen.work-item-wiki/changelog">Changelog</a>
    ·
    <a href="https://github.com/joachimdalen/azdevops-work-item-wiki/issues">Report Bug</a>
    ·
    <a href="https://github.com/joachimdalen/azdevops-work-item-wiki/issues">Request Feature</a>
  </p>
</div>

## Features

Work item wiki is a control to render a wikipage inside a work item page. This can be useful if you need to document something for that work item type. For example definition of done/ready, bug categories etc.

Example where rendered on custom page:

![Product Name Screen Shot](marketplace/docs/images/bug-example.png)

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

## Post Install Configuration

Work Item Link is a custom form control that needs to be added to the Work Item Form. It can be added on an existing page, or as a new tab. For how to do this, refer to the [official documentation](https://docs.microsoft.com/en-us/azure/devops/organizations/settings/work/custom-controls-process?view=azure-devops#add-a-field-level-contribution-or-custom-control).

Wiki Url is the url to the wiki page, it should look something like: `https://dev.azure.com/organization/demo-project/_wiki/wikis/demo-project.wiki/1/This-is-a-page`

| ![Config one](marketplace/docs/images/control-config-1.png) | ![Config two](marketplace/docs/images/control-config-2.png) |
| ----------------------------------------------------------- | ----------------------------------------------------------- |

## Contact

If you have generic questions about the project or usage you can make contact in the following ways:

- Submit an issue over at GitHub with the `@type/question` label - [New Issue](https://github.com/joachimdalen/azdevops-work-item-wiki/issues/new)
- Submit a new question under the Marketplace Q&A section.

<p align="right">(<a href="#top">back to top</a>)</p>
