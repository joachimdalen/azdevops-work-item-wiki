import { visit } from 'unist-util-visit';

const regex = /^!\[.+\]\((?<url>.+\s=(?<width>\d+)?x(?<height>\d+)?)\)$/;

function visitTextBlock(ast: any) {
  return visit(ast, 'text', (node: any, index: any, parent: any) => {
    const { value } = node;
    console.log(node, index, parent);
    if (value === undefined) return node;

    if (regex.test(value)) {
      const match = regex.exec(value);

      if (match !== null && match.groups) {
        const url = match.groups['url'];

        const newNode = {
          type: 'image',
          title: '',
          url
        };

        parent.children.splice(index, 1, newNode);

        return node;
      }
    }

    return node;
  });
}

function sizableImageRemark() {
  return function transformer(ast: any, vFile: any, next: any): any {
    visitTextBlock(ast);

    if (typeof next === 'function') {
      return next(null, ast, vFile);
    }

    return ast;
  };
}

export default sizableImageRemark;
