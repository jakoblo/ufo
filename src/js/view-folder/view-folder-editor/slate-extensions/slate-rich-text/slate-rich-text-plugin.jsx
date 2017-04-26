// @flow

import React from "react";
import { Mark, Character, Text } from "slate";
import _ from "lodash";
import isUrl from "is-url";
import tld from "tldjs";
import { List } from "immutable";
import { shell } from "electron";
import normalizeUrl from "normalize-url";

import MarkdownLink from "./components/slate-markdown-link";
import HoverToolbar from "./components/slate-hover-toolbar";
import BlockSelector from "./components/slate-block-selector";
import {
  BLOCK_TYPES,
  INLINE_TYPES,
  DEFAULT_NODE,
  MARK_TYPES
} from "../rich-text-types";
import * as c from "../../folder-editor-constants";

/*
  Marks
  https://docs.slatejs.org/reference/models/mark.html
 */

const hasMark = (type: string, editor: any) => {
  const state = editor.getState();
  return state.marks.some(mark => mark.type == type);
};

const toggleMark = (type, editor) => {
  const state = editor.getState().transform().toggleMark(type).apply();
  editor.onChange(state);
};

/*
  BLOCKs
  https://docs.slatejs.org/reference/models/block.html
 */

const hasBlock = (block: any, type: string, editor: any) => {
  return block.type == type;
};

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

/*
  Inline => Links
  https://docs.slatejs.org/reference/models/inline.html
 */

const isLink = (editor: any) => {
  const state = editor.getState();
  return (
    state.inlines.filter(inline => inline.type == INLINE_TYPES.LINK.type)
      .size == 1
  );
};

const toggleLink = (editor: any) => {
  let state = editor.getState();
  if (isLink(editor)) {
    // Remove the links
    state = state.transform().unwrapInline(INLINE_TYPES.LINK.type).apply();
  } else if (state.isExpanded) {
    // Create an Empty Link
    // Toolbar will transform to add the url
    state = state
      .transform()
      .wrapInline({
        type: INLINE_TYPES.LINK.type,
        data: { href: null }
      })
      .apply();
  } else {
    console.error("Set link without selection shouldt be possible");
  }

  editor.onChange(state);
};

const setLinkHref = (href: string, editor: any) => {
  let state = editor.getState();

  if (isLink(editor)) {
    state = state
      .transform()
      .setInline({
        type: INLINE_TYPES.LINK.type,
        data: { href }
      })
      .apply();
    editor.onChange(state);
  }
};

const getHrefFromSelectedInline = editor => {
  const state = editor.getState();
  const linkInlines = state.document
    .getInlinesAtRange(state.selection)
    .filter(inline => inline.type == INLINE_TYPES.LINK.type);
  if (linkInlines.size != 1) {
    console.error(
      "Request Href for multiple or no link. Should be a single Inline Link"
    );
  }
  return linkInlines.first().data.get("href");
};

/*
  Build Render schema
  https://docs.slatejs.org/reference/models/schema.html
 */

const blockSchema = (() => {
  const schema = {};
  Object.keys(BLOCK_TYPES).forEach(key => {
    schema[key] = props => {
      return (
        <div
          {...props.attributes}
          className={"text-block text-block--" + BLOCK_TYPES[key].className}
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
})();

const inlineSchema = {
  [INLINE_TYPES.LINK.type]: props => {
    const { data } = props.node;

    let href = null;
    try {
      href = normalizeUrl(data.get("href"));
    } catch (e) {
      href = null;
    }

    const className = "inline--" + INLINE_TYPES.LINK.className;
    return (
      <span {...props.attributes} className={className}>
        <span className={className + "__text"}>
          {props.children}
        </span>
        <span
          contentEditable={false}
          className={className + "__link-opener"}
          onMouseDown={event => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            if (href) {
              shell.openExternal(href);
            }
          }}
        >
          X
        </span>
      </span>
    );
  }
};

const marksSchema = (() => {
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
})();

/**
 * Slate RichTextPlugin
 */
export default function RichText(): any {
  return {
    render: (props: Object, state: any, editor: any) => {
      return (
        <div>
          <HoverToolbar
            hasMark={hasMark}
            toggleMark={toggleMark}
            isLink={isLink}
            toggleLink={toggleLink}
            setLinkHref={setLinkHref}
            getHrefFromSelectedInline={getHrefFromSelectedInline}
            editor={editor}
          />
          {props.children}
        </div>
      );
    },
    // @TODO
    // onKeyDown: (e, data, state) => {
    //   if (!data.isMod) return;
    //   let mark;
    //
    //   switch (data.key) {
    //     case "b":
    //       mark = "bold";
    //       break;
    //     case "i":
    //       mark = "italic";
    //       break;
    //     case "u":
    //       mark = "underlined";
    //       break;
    //     case "`":
    //       mark = "code";
    //       break;
    //     default:
    //       return;
    //   }
    //
    //   state = state.transform().toggleMark(mark).apply();
    //
    //   e.preventDefault();
    //   return state;
    // },
    onPaste: (e: Event, data: Object, state: any) => {
      if (data.type != "text" && data.type != "html") return;
      if (!isUrl(data.text)) return;

      const url = data.text;
      const domain = tld.getDomain(url);

      const transform = state.transform();

      if (state.isCollapsed) {
        return transform
          .insertInline({
            type: INLINE_TYPES.LINK.type,
            data: {
              href: url
            },
            nodes: [Text.createFromString(domain || url)]
          })
          .apply();
      } else {
        if (isLink()) {
          transform.unwrapInline(INLINE_TYPES.LINK.type);
        }

        return transform
          .wrapInline({
            type: INLINE_TYPES.LINK.type,
            data: {
              href: data.text
            }
          })
          .collapseToEnd()
          .apply();
      }
    },
    schema: {
      nodes: { ...blockSchema, ...inlineSchema },
      marks: marksSchema
    }
  };
}
