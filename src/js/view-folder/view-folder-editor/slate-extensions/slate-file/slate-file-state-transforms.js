// @flow
import { Block, Text, Selection } from "slate";
import * as slateUtils from "./slate-file-utils";
import { List } from "immutable";

export const removeExisting = (transforming: any, basename: string): any => {
  const existingFileBlock = slateUtils.getFileBlockByBase(
    transforming.state,
    basename
  );
  if (existingFileBlock) {
    transforming = transforming.removeNodeByKey(existingFileBlock.get("key"));
  }
  return transforming;
};

export const insertFile = (transforming: any, basename: string): any =>
  transforming.splitBlock().insertBlock(slateUtils.createFileBlock(basename));

/*
* [FileItem]|
* to:
* [FileItem]
* |
* --- or ---
* |[FileItem]
* to:
* |
* [FileItem]
*/
export const createNewLineAroundFileBlock = (
  transforming: any,
  range: Selection
): any => {
  // Invert Selection Position, to split in the right direction.
  // Do not really understand why, but works fine.
  const splitSelectionOffset = range.focusOffset == 0 ? 1 : 0;
  const splitRange = new Selection({
    ...range.toJS(),
    anchorKey: range.focusKey,
    anchorOffset: splitSelectionOffset,
    focusOffset: splitSelectionOffset
  });
  return transforming.collapseToFocus().splitBlockAtRange(splitRange).setBlock({
    type: "markdown",
    isVoid: false,
    // nodes: List([Text.createFromString('')]),
    data: {}
  });
};

export const insertFileAtEnd = (
  transforming: any,
  document: any,
  basename: string
): any => {
  const block = Block.create(slateUtils.getFileBlockProperties(basename));
  return transforming.insertNodeByKey(document.key, document.nodes.size, block);
};

export const renameFile = (
  state: any,
  transforming: any,
  sourceBase: string,
  targetBase: string
): any => {
  const sourceBlock = slateUtils.getFileBlockByBase(state, sourceBase);
  if (!sourceBlock) return transforming;
  return transforming.setNodeByKey(
    sourceBlock.key,
    slateUtils.getFileBlockProperties(targetBase)
  );
};

export const removeFiles = (state: any, baseList: Array<string>): any => {
  let transforming = state.transform();
  baseList.forEach(fileBase => {
    transforming = removeExisting(transforming, fileBase);
  });
  return transforming.apply({ save: false });
};

export const insertFilesAt = (
  state: any,
  baseList: Array<string>,
  indexPosition: number
): any => {
  let transforming = state.transform();
  baseList.forEach(fileBase => {
    transforming = transforming.insertNodeByKey(
      state.document.key,
      indexPosition,
      slateUtils.createFileBlock(fileBase)
    );
  });
  return transforming.apply({ save: false });
};
