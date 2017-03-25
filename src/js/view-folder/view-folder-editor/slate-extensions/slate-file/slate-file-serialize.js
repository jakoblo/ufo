//@flow
import { Raw, State } from "slate";
import * as slateUtils from "./slate-file-utils";
import * as c from "../../folder-editor-constants";

/**
 * Deserialize a plain text `string` to a state.
 */
export function plainToState(string: string): Class<State> {
  const raw = {
    kind: "state",
    document: {
      kind: "document",
      nodes: string.split("\n").map(line => {
        if (line.match(/<.*>/)) {
          // insert Void Block with filename as data
          const fileBase = line.substring(1, line.length - 1);
          return slateUtils.getRawFileBlock(fileBase);
        } else {
          return {
            kind: "block",
            type: "line",
            nodes: [
              {
                kind: "text",
                ranges: [
                  {
                    text: line,
                    marks: []
                  }
                ]
              }
            ]
          };
        }
      })
    }
  };

  return Raw.deserialize(raw);
}

/**
 * Serialize a `state` to plain text.
 */
export function stateToPlain(state: Class<State>): string {
  return state.document.nodes
    .map(block => {
      if (block.type == c.BLOCK_TYPE_FILE) {
        return "<" + block.getIn(["data", "base"]) + ">";
      } else {
        return block.text;
      }
    })
    .join("\n");
}
