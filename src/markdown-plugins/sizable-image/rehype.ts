import { visit } from 'unist-util-visit';

const regex = /^(?<url>.+)\s=(?<width>\d+)?x(?<height>\d+)?$/;

export default function sizableImage(): any {
  return transformer;

  function transformer(tree: any, file: any) {
    visit(tree, 'element', visitor);
    function visitor(node: any) {
      if (node.tagName === 'img') {
        const src = decodeURIComponent(node.properties.src);

        if (regex.test(src)) {
          const match = regex.exec(src);

          if (match !== null && match.groups) {
            const url = match.groups['url'];
            const width = match.groups['width'];
            const height = match.groups['height'];

            node.properties.src = url;
            node.properties.width = width;
            node.properties.height = height;
          }
        }
      }
    }
  }
}
