// @flow

import React from "react";
import { Mark, Character } from "slate";
import _ from "lodash";
import MarkdownLink from "./components/slate-markdown-link";
import HoverToolbar from "./components/slate-hover-toolbar";
import BlockSelector from "./components/slate-block-selector";
import { BLOCK_TYPES, DEFAULT_NODE, MARK_TYPES } from "../rich-text-types";
import * as c from "../../folder-editor-constants";

export default function RichText(): any {
  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  const hasMark = (type: string, editor: any) => {
    const state = editor.getState();
    return state.marks.some(mark => mark.type == type);
  };

  /**
  * Check if the any of the currently selected blocks are of `type`.
  *
  * @param {String} type
  * @return {Boolean}
  */

  const hasBlock = (block: any, type: string, editor: any) => {
    return block.type == type;
    // const state = editor.getState();
    // return state.blocks.some(node => node.type == type);
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  const toggleMark = (type, editor) => {
    const state = editor.getState().transform().toggleMark(type).apply();
    editor.onChange(state);
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} e
   * @param {String} type
   */

  const toggleBlock = (block: any, type: string, editor: any) => {
    let state = editor.getState();
    const transform = state.transform();
    const { document } = state;

    // Handle everything but list buttons.
    const isActive = hasBlock(block, type);

    transform.setNodeByKey(block.key, {
      type: isActive ? DEFAULT_NODE.type : type
    });

    state = transform.apply();
    editor.onChange(state);
  };

  return {
    render: (props: Object, state: any, editor: any) => {
      return (
        <div>
          <HoverToolbar
            hasMark={hasMark}
            hasBlock={hasBlock}
            toggleMark={toggleMark}
            toggleBlock={toggleBlock}
            editor={editor}
          />
          {props.children}
        </div>
      );
    },
    onKeyDown: (e, data, state) => {
      if (!data.isMod) return;
      let mark;

      switch (data.key) {
        case "b":
          mark = "bold";
          break;
        case "i":
          mark = "italic";
          break;
        case "u":
          mark = "underlined";
          break;
        case "`":
          mark = "code";
          break;
        default:
          return;
      }

      state = state.transform().toggleMark(mark).apply();

      e.preventDefault();
      return state;
    },
    schema: {
      nodes: (() => {
        const schema = {};
        Object.keys(BLOCK_TYPES).forEach(key => {
          schema[key] = props => {
            return (
              <div
                {...props.attributes}
                className={
                  "text-block text-block--" + BLOCK_TYPES[key].className
                }
              >
                <BlockSelector
                  block={props.node}
                  readOnly={props.readOnly}
                  editor={props.editor}
                  hasBlock={hasBlock}
                  toggleBlock={toggleBlock}
                  getScrollContainer={props.editor.props.getScrollContainer}
                />
                <div className="text-block__content">
                  {props.children}
                </div>
              </div>
            );
          };
        });
        return schema;
      })(),
      marks: (() => {
        const schema = {};
        Object.keys(MARK_TYPES).forEach(key => {
          schema[key] = props => {
            return (
              <span className={"mark--" + MARK_TYPES[key].className}>
                {props.children}
              </span>
            );
          };
        });
        return schema;
      })()

      //
      // {
      //   "title-1": {
      //     fontSize: "18px",
      //     margin: "20px 0 10px 0",
      //     display: "inline-block"
      //   },
      //   "title-2": {
      //     fontSize: "16px",
      //     margin: "10px 0 0px 0",
      //     display: "inline-block"
      //   },
      //   "title-3": {
      //     textTransform: "uppercase"
      //   },
      //   bold: {
      //     fontWeight: "bold"
      //   },
      //   italic: {
      //     fontStyle: "italic"
      //   },
      //   code: {
      //     fontFamily: "monospace",
      //     backgroundColor: "#eee",
      //     padding: "3px",
      //     borderRadius: "4px"
      //   },
      //   punctuation: {
      //     opacity: 0.5
      //   },
      //   list: {
      //     paddingLeft: "10px",
      //     paddingRight: "10px",
      //     color: "#000"
      //   },
      //   hr: {
      //     borderBottom: "2px solid #000",
      //     display: "block",
      //     opacity: 0.5
      //   },
      //   url: (props: any) => {
      //     const { node } = props;
      //     const { data } = node;
      //     const urlWithBrackets = node.text.match(/\(.*\)/)[0];
      //     const url = urlWithBrackets.substring(1, urlWithBrackets.length - 1);
      //     return (
      //       <MarkdownLink url={url}>
      //         {props.children}
      //       </MarkdownLink>
      //     );
      //   },
      //   imageURL: (props: any) => {
      //     const { node } = props;
      //     const { data } = node;
      //     const urlWithBrackets = node.text.match(/\(.*\)/)[0];
      //     const url = urlWithBrackets.substring(1, urlWithBrackets.length - 1);
      //     return (
      //       <MarkdownLink url={url}>
      //         {props.children}
      //       </MarkdownLink>
      //     );
      //   },
      //   plainURL: (props: any) => {
      //     const { node } = props;
      //     return (
      //       <MarkdownLink url={node.text}>
      //         {props.children}
      //       </MarkdownLink>
      //     );
      //   }
      // }
    }
  };
}
