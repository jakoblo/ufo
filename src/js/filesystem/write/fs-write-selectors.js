import { createSelector } from 'reselect'
import * as c from './fs-write-constants'
import nodePath from 'path'

/**
 * Get FsWriteStoreState
 * 
 * @param  {State} state - redux store state
 * @returns {ImmuteableOrderedMap} - of Write Tasks
 */
export const getFSWrite = (state) => state[c.NAME]

/**
 * Get the write percentage progress of the file
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the File
 * @returns {int | false} - percentage progress in int or false if no progress
 */
export const getProgressOfFile__Factory = (state, path) => {
  return createSelector(
    [getProgressList, (state, path) => path],
    (progressList, path) => {
      return (progressList[path] || false)
    }
  )
}

/**
 * Get the percentage of the files which are currently in progress
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the File
 * @returns {Array} - percentage progress in int
 */
const getProgressList = createSelector(
  [getFSWrite], 
  (fsWrite, path) => {
    let list = []
    fsWrite.forEach((mainTask) => {
      const subTasks = mainTask.get('subTasks')
      if(subTasks) {
        subTasks.forEach((subTask) => {
          list[subTask.get('destination')] = subTask.get('percentage')
        })
      }
    })
    return list
  }
)

/**
 * get the fs write entrys for a Folder
 * @param  {Object} state of the redux store
 * @param  {Object} path {path: string}
 * @returns Immuteable Map of fs write entry Objects
 */
// const getOfFolderFactory = (state, path) => {
//   return createSelector(
//     [getFSWrite, getPath], (fsWrite, path) => {
//       return fsWrite.map((entry) => {
//         if(nodePath.dirname(entry.get('destination')) == path) {
//           return entry
//         }
//       })
//     }
//   )
// }

/**
 * get the progress objects for a folder to display progressbars 
 * 
 * @param  {Object} state of the redux store
 * @param  {Object} path {path: string}
 * @returns Immuteable Map of progress Objects
 */
// const getSubTasksOfFolderFactory = (state, path) => {

//   let getOfFolder = getOfFolderFactory()

//   return createSelector(
//     [getFSWrite, getPath], (fsWrite, path) => {
//     let progressingFiles = []
//     fsWrite.forEach((task) => {
//       if(task.get('subTasks')) {
//         task.get('subTasks').forEach((subTask) => {
//           if(nodePath.dirname(subTask.get('destination')) == path ) {
//             progressingFiles.push(subTask)
//           }
//         })
//       }
//     })
//     return (progressingFiles.length > 0) ? progressingFiles : null
//   })
// }