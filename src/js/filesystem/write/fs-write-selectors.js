import { createSelector } from 'reselect'
import * as c from './fs-write-constants'
import nodePath from 'path'

export const getFSWrite = (state, props) => state[c.NAME]
export const getPath = (state, props) => props.path

export const getProgressOfFile__Factory = (state, props) => {
  return createSelector(
    [getProgressList, getPath],
    (progressList, path) => {
      return (progressList[path] || false)
    }
  )
}

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
 * @param  {Object} props {path: string}
 * @returns Immuteable Map of fs write entry Objects
 */
// const getOfFolderFactory = (state, props) => {
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
 * @param  {Object} props {path: string}
 * @returns Immuteable Map of progress Objects
 */
// const getSubTasksOfFolderFactory = (state, props) => {

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