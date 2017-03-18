// @flow

import React from "react";
import classnames from "classnames";
import nodePath from "path";
import { connect } from "react-redux";
import { Editor } from "slate";
import * as FsMergedSelector from "../../../filesystem/fs-merged-selectors";
import * as c from "../folder-editor-constants";
import * as Actions from "../folder-editor-actions";
import * as selectors from "../folder-editor-selectors";
import Filter from "../../../filesystem/filter/filter-index";
import SlateFile from "../slate-extensions/slate-file/slate-file-index";
import MarkdownPlugin
  from "../slate-extensions/slate-markdown/slate-markdown-plugin";
import Config from "../../../config/config-index";
import * as Utils from "../../../utils/utils-index";

import Loading from "../../../general-components/loading";

type ComponentProps = {
  path: string
};

type Props = {
  path: string,
  focused: boolean,
  editorState: any,
  readOnly: boolean,
  dispatch: Dispatch
};

type State = {};

const mapStateToProps = (state: any, props: ComponentProps) => {
  const getFiltedBaseArrayOfFolder = FsMergedSelector.getFiltedBaseArrayOfFolder_Factory();
  return (state, props) => {
    return {
      focused: Filter.selectors.isFocused(state, props.path),
      fileList: getFiltedBaseArrayOfFolder(state, props.path),
      editorState: selectors.getEditorState(state, props.path),
      readOnly: Config.selectors.getReadOnlyState(state)
    };
  };
};

class FolderEditor extends React.Component {
  props: Props;
  state: State;

  filePlugin: any;

  constructor(props: Props) {
    super(props);
    this.filePlugin = SlateFile.slatePlugin_Factory({
      BLOCK_TYPE: c.BLOCK_TYPE_FILE,
      folderPath: props.path,
      dispatch: this.props.dispatch
    });
  }

  render() {
    return (
      <div className="view-folder__editor-container">
        {this.props.editorState
          ? <Editor
              state={this.props.editorState}
              className="slate-editor"
              plugins={[this.filePlugin, MarkdownPlugin]}
              onChange={this.onChange}
              readOnly={this.props.readOnly}
              onDocumentChange={this.onDocumentChange}
            />
          : <Loading />}
      </div>
    );
  }

  stopEvent(e: SyntheticDragEvent) {
    console.log("stop");
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  }

  componentDidMount() {
    this.props.dispatch(Actions.folderEditorInit(this.props));
  }

  onChange = (editorState: any) => {
    // console.log('external onchange')
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
    const content = SlateFile.serialize.stateToPlain(this.props.editorState);
    Utils.fs.saveFile(path, content);
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
