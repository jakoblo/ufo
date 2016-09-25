export const NAME = 'fsWrite'

// export const IPC_FS_MOVE = 'FS_MOVE'

// export const CHILD_ERR = 'CHILD_ERR'
// export const CHILD_LOG = 'CHILD_LOG'
// export const CHILD_START = 'CHILD_START'
// export const CHILD_PROGRESS = 'CHILD_PROGRESS'
// export const CHILD_DONE = 'CHILD_DONE'

export const ERROR_NOT_EXISTS = "ENOENT"
export const ERROR_IS_DIR = "EISDIR"
export const ERROR_OPERATION_NOT_PERMITTED = "EPERM"
export const ERROR_RENAME_CROSS_DEVICE = "EXDEV"
export const ERROR_DEST_ALREADY_EXISTS = "ERROR_DEST_ALREADY_EXISTS"
export const ERROR_MOVE_IN_IT_SELF = "ERROR_MOVE_IN_IT_SELF"


export const MESSAGES = {
  ERROR_NOT_EXISTS: "Source or target folder are not existing.",
  ERROR_OPERATION_NOT_PERMITTED: "FileFlow is not the permission to do that.",
  ERROR_RENAME_CROSS_DEVICE: "Can't rename from One device to an other. You should never see this Message. Else something is wrong with FileFlow.",
  ERROR_DEST_ALREADY_EXISTS: "There is already something like that. I can overwrite that for you, but that is maybe an bad idea.",
  ERROR_MOVE_IN_IT_SELF: "You can not move a folder in to it self"
}