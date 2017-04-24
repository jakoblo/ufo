// @flow

import React from "react";
import classnames from "classnames";
import nodePath from "path";
import { connect } from "react-redux";
import { Editor, Raw } from "slate";
import * as c from "../folder-editor-constants";
import * as Actions from "../folder-editor-actions";
import * as selectors from "../folder-editor-selectors";
import Selection from "../../../filesystem/selection/sel-index";
import SlateFile from "../slate-extensions/slate-file/slate-file-index";
import RichText
  from "../slate-extensions/slate-rich-text/slate-rich-text-plugin";

import Config from "../../../config/config-index";
import * as Utils from "../../../utils/utils-index";

import Loading from "../../../general-components/loading";

type Props = {
  path: string,
  focused: boolean,
  editorState: any,
  fileList: Array<string>,
  readOnly: boolean,
  dispatch: Function
};

type State = {
  scrollPosition: number
};

const mapStateToProps = (state, props) => {
  return {
    focused: Selection.selectors.getSelectionRoot(state) == props.path,
    editorState: selectors.getEditorState(state, props.path),
    readOnly: Config.selectors.getReadOnlyState(state)
  };
};

class FolderEditor extends React.Component {
  props: Props;
  filePlugin: any;
  richtTextPlugin: any;
  editor: any;
  state: State;
  container: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      scrollPosition: 0
    };
    this.filePlugin = SlateFile.slatePlugin_Factory({
      BLOCK_TYPE: c.BLOCK_TYPE_FILE,
      folderPath: props.path,
      dispatch: this.props.dispatch
    });
    this.richtTextPlugin = RichText();
  }

  render() {
    const editorClasses = classnames("view-folder__editor-container", {
      "view-folder__editor-container--focused": this.props.focused,
      "view-folder__editor-container--edit-mode": !this.props.readOnly,
      "view-folder__editor-container--readonly-mode": this.props.readOnly
    });
    return (
      <div
        className={editorClasses}
        ref={ref => {
          this.container = ref;
        }}
        onMouseDown={e => {
          // Avoid preventDefault by root event catcher
          // Default event actions is needed by the editor
          e.stopPropagation();
        }}
        onMouseUp={event => {
          // Focus typeSelection & Scroll to
          this.props.dispatch(Selection.actions.focusDir(this.props.path));
        }}
        onScroll={() => {
          this.setState({
            scrollPosition: this.container.scrollTop
          });
        }}
      >
        {this.props.editorState
          ? <Editor
              state={this.props.editorState}
              className="slate-editor"
              ref={editor => (this.editor = editor)}
              plugins={[this.filePlugin, this.richtTextPlugin]}
              onChange={this.onChange}
              readOnly={this.props.readOnly}
              scrollPosition={this.state.scrollPosition}
              getScrollContainer={() => this.container}
              onDocumentChange={this.onDocumentChange}
              onFocus={() => {
                // Not needed right now
                // this.props.dispatch(
                //   Selection.actions.focusDir(this.props.path)
                // );
              }}
              onBlur={() => {
                // Not needed right now
                //
                // process.nextTick(() => {
                //   // Keep focus on editor
                //   // by click on a button or somewhere in the app
                //   if (this.props && this.props.focused) {
                //     this.editor.focus();
                //   }
                // });
              }}
            />
          : <Loading />}
      </div>
    );
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.editorState != nextProps.editorState ||
      this.props.readOnly != nextProps.readOnly ||
      this.state.scrollPosition != nextState.scrollPosition ||
      this.props.focused != nextProps.focused
    );
  }

  stopEvent(e: SyntheticDragEvent) {
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  }

  componentDidMount() {
    this.props.dispatch(Actions.folderEditorInit(this.props.path));
  }

  onChange = (editorState: any) => {
    this.props.dispatch(
      Actions.folderEditorChange(this.props.path, editorState)
    );
  };

  onDocumentChange = (document: any, state: any) => {
    clearTimeout(this.savingTimout);
    this.savingTimout = setTimeout(this.saveDocument, 5000);
  };

  savingTimout = null;

  saveDocument = () => {
    this.savingTimout = null;
    console.log("save " + this.props.path);
    const path = nodePath.join(this.props.path, c.INDEX_BASE_NAME);
    const content = Raw.serialize(this.props.editorState, { terse: true });

    Utils.fs.saveFile(path, JSON.stringify(content));
  };

  componentWillReceiveProps(nextProps: Props) {}

  componentWillUnmount() {
    if (this.savingTimout) {
      clearTimeout(this.savingTimout);
      this.saveDocument();
    }
    this.props.dispatch(Actions.folderEditorClose(this.props.path));
  }
}

export default connect(mapStateToProps)(FolderEditor);
