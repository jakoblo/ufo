//@flow
import { Raw, State } from "slate";
import * as slateUtils from "./slate-file-utils";
import * as c from "../../folder-editor-constants";
import { BLOCK_TYPES } from "../rich-text-types";
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
 * Detect the block type and strip the markdown prefix from a text line.
 * Returns { type, text }.
 */
function parseLineType(line) {
  if (/^### /.test(line)) return { type: BLOCK_TYPES.HEADING_THREE.type, text: line.slice(4) };
  if (/^## /.test(line))  return { type: BLOCK_TYPES.HEADING_TWO.type,   text: line.slice(3) };
  if (/^# /.test(line))   return { type: BLOCK_TYPES.HEADING_ONE.type,   text: line.slice(2) };
  if (/^[*-] /.test(line)) return { type: BLOCK_TYPES.LIST_ITEM.type,    text: line.slice(2) };
  if (/^> /.test(line))   return { type: BLOCK_TYPES.QUOTE.type,         text: line.slice(2) };
  return { type: BLOCK_TYPES.PARAGRAPH.type, text: line };
}

/**
 * Serialize a block type back to its markdown prefix.
 */
function typeToPrefix(type) {
  switch (type) {
    case BLOCK_TYPES.HEADING_ONE.type:   return "# ";
    case BLOCK_TYPES.HEADING_TWO.type:   return "## ";
    case BLOCK_TYPES.HEADING_THREE.type: return "### ";
    case BLOCK_TYPES.LIST_ITEM.type:     return "- ";
    case BLOCK_TYPES.QUOTE.type:         return "> ";
    default:                             return "";
  }
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

  function getTextBlock(rawText) {
    const { type, text } = parseLineType(rawText);
    return {
      kind: "block",
      type: type,
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
        return typeToPrefix(block.type) + block.text;
      }
    })
    .join("\n");
}
