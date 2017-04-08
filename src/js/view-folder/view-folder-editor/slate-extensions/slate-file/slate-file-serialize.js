//@flow
import { Raw, State } from "slate";
import * as slateUtils from "./slate-file-utils";
import * as c from "../../folder-editor-constants";
import nodePath from "path";

// Global regEx, important for while exec
//
// Matches:
// ![filename](./filename)
// [filename](./filename)
//
// Matches not:
// [link](http://url)
// [file name](./file name) // with space
const fileLinkRegEx = /!?\[[^\]]+\]\(\.\/[^\s)]+\)/;

function getUrl(markdownLink) {
  const urlRegEx = /\]\([^\s\)]+(?=\))/;
  return urlRegEx.exec(markdownLink)[0].slice(2); // ](url.... // remove ](
}

/**
 * Deserialize a plain markdown `string` to a state.
 */
export function markdownToState(string: string): Class<State> {
  const nodes = [];

  string.split("\n").forEach(line => {
    // Each file has to be in a block/line

    let fileMatch;

    // Find File and Create Blocks for them
    while ((fileMatch = fileLinkRegEx.exec(line))) {
      const matchString = fileMatch[0];
      const asImage = matchString.indexOf("!") == 0;
      const path = decodeURI(getUrl(matchString));
      const baseName = nodePath.basename(path);

      // Add line for Text before File
      if (fileMatch.index > 0) {
        nodes.push(getTextBlock(line.slice(0, fileMatch.index)));
      }

      nodes.push(slateUtils.getRawFileBlock(baseName, asImage));

      // set line the text which is left
      line = line.slice(fileMatch.index + matchString.length);
      if (line.length == 0) {
        // The line is done
        // return to avoid to creation of a empty line
        return;
      }
    }

    // Create line for the rest of a fileblock line
    // or a normal markdown line
    nodes.push(getTextBlock(line));
  });

  const raw = {
    kind: "state",
    document: {
      kind: "document",
      nodes: nodes
    }
  };

  return Raw.deserialize(raw);

  function getTextBlock(text) {
    return {
      kind: "block",
      type: "line",
      nodes: [
        {
          kind: "text",
          ranges: [
            {
              text: text,
              marks: []
            }
          ]
        }
      ]
    };
  }
}

/**
 * Serialize a `state` to plain markdown.
 */
export function stateToMarkdown(state: Class<State>): string {
  return state.document.nodes
    .map(block => {
      if (block.type == c.BLOCK_TYPE_FILE) {
        const filename = block.getIn(["data", "base"]);
        const imageFlag = block.getIn(["data", "asImage"]) ? "!" : "";
        return imageFlag + "[" + filename + "](./" + encodeURI(filename) + ")";
      } else {
        return block.text;
      }
    })
    .join("\n");
}
