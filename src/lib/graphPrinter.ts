import { gtAnchor, gtBlock, gtOperation, type GraphAnchorNode, type GraphNode, type NodeMeta } from "../executionGraph";
import * as Token from "../tokens";

function formatMetaEntry(key: string, value: any) {
  let v;

  if (key === 'view') {
    return value
  }

  if (Token.isToken(value)) {
    if (Token.isLiteral(value)) {
      return Token.printLiteral(value)
    } else {
      v = Token.print(value)
    }
  } else {
    v = JSON.stringify(value)
  }

  return `${key}: ${v}`
}
function formatMeta(meta: NodeMeta): string {
  if (!meta || Object.keys(meta).length === 0) {
    return '';
  }

  const entries = Object.entries(meta)
  .map(([key, value]) => formatMetaEntry(key, value))
  .join(', ');

  return ` (${entries})`;
}

/**
 * Recursively walks the graph from a given node and generates an array of formatted strings.
 *
 * @param node The starting node to process.
 * @param level The current indentation level for hierarchical display.
 * @returns An array of strings representing the graph segment.
 */
function walkGraph(node: GraphNode | null, level: number): string[] {
  if (!node) {
    return [];
  }

  const output: string[] = [];
  let currentNode: GraphNode | null = node;

  while (currentNode) {
    const indentation = '   '.repeat(level); // 3 spaces for clear indentation
    const metaString = formatMeta(currentNode.meta);

    switch (currentNode.type) {
      case gtOperation:
        output.push(`${indentation}• ${currentNode.name}${metaString}`);
        break;

      case gtBlock:
        // A block has a header, nested content, and a footer
        output.push(`${indentation}┌ ${currentNode.name}${metaString}`);

        // Recursively process the children at the next indentation level
        const childLines = walkGraph(currentNode.children, level + 1);

        // Prepend each child line with a vertical bar to show connection
        childLines.forEach(line => {
          output.push(`${indentation}│ ${line.trimStart()}`);
        });

        output.push(`${indentation}└─ End Block: ${currentNode.name}`);
        break;

      case gtAnchor:
        // Anchors are entry points and should not be printed within the graph.
        // We simply ignore them if encountered.
        break;

      default:
        // Handle unknown node types gracefully
        output.push(`${indentation}? Unknown Node Type`);
        break;
    }

    currentNode = currentNode.next;
  }

  return output;
}

/**
 * Generates a pretty-printed string representation of a computation graph.
 *
 * @param anchorNode The root anchor node of the graph. The anchor itself is not printed.
 * @returns A multi-line string visualizing the computation flow.
 */
export function prettyPrintGraph(anchorNode: GraphAnchorNode): string {
  if (!anchorNode || anchorNode.type !== gtAnchor) {
    console.error("Invalid input: An anchor node is required.");
    return "[Invalid Graph Input]";
  }

  // The actual computation starts from the node *after* the anchor.
  const lines = walkGraph(anchorNode.next, 0);

  if(lines.length === 0) {
    return "[Empty Computation Graph]";
  }

  return lines.join('\n');
}

