// @flow

"use strict";
import React from "react";
import type { Children } from "react";
import classnames from "classnames";
import * as slateUtils from "../slate-file-utils";

type Props = {
  editor: any,
  node: any,
  children?: Children
};

export default class VoidCursorEmulator extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { editor, node } = this.props;
    const state = editor.getState();
    const selection = state.selection;
    const cursorLeft = selection.hasFocusAtStartOf(node);
    const cursorRight = selection.hasFocusAtEndOf(node);

    const classes = classnames({
      "void-cursor-emulator": true,
      "void-cursor-emulator--cursor-left": cursorLeft,
      "void-cursor-emulator--cursor-right": cursorRight
    });

    return (
      <div
        className={classes}
        onClick={event => {
          // Prevent Selection change in slate editor
          event.stopPropagation();
          event.preventDefault();
          this.props.editor.focus();
        }}
        onMouseDown={event => {
          event.stopPropagation();
          if (event.shiftKey) {
            this.expandSelection();
          }
        }}
        onMouseUp={event => {
          event.stopPropagation();
          if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
            this.setSelection();
          }
        }}
      >
        {this.props.children}
      </div>
    );
  }

  expandSelection = () => {
    const { node, editor } = this.props;
    const state = editor.getState();
    const { selection } = state;
    const startNode = state.document.findDescendant(
      node => node.key == selection.startKey
    );
    const startIndex = slateUtils.getIndexOfNodeInDocument(state, startNode);
    const currentIndex = slateUtils.getIndexOfNodeInDocument(state, node);
    const transformFunc = startIndex > currentIndex
      ? "extendToStartOf"
      : "extendToEndOf";

    editor.onChange(state.transform()[transformFunc](node).focus().apply());
  };

  setSelection = () => {
    console.log("setslection");
    const { editor, node } = this.props;
    const state = editor.getState();

    const newSelection = slateUtils.createSelectionForFile(node);

    editor.onChange(state.transform().select(newSelection).apply());
  };
}
