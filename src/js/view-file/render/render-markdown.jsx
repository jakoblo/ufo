// @flow
import React from "react";
import nodePath from "path";
import Loading from "../../general-components/loading";

type Props = {
  path: string
};

type State = {
  FolderEditor: ?any
};

// FolderEditor is required lazily at mount time to avoid a circular
// module dependency: vf-index → view-file → get-renderer → render-markdown
// → folder-editor → SlateFile → file-item → fi-actions → vf-index
export default class RenderMarkdown extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = { FolderEditor: null };
  }

  componentDidMount() {
    const FolderEditor = require("../../view-folder/view-folder-editor/components/folder-editor")
      .default;
    this.setState({ FolderEditor });
  }

  render() {
    const { FolderEditor } = this.state;
    if (!FolderEditor) return <Loading />;
    const folderPath = nodePath.dirname(this.props.path);
    return (
      <div className="render-markdown">
        <FolderEditor path={folderPath} filePath={this.props.path} />
      </div>
    );
  }
}
