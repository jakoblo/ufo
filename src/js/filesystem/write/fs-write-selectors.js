import { createSelector } from 'reselect'
import * as c from './fs-write-constants'
import nodePath from 'path'

export const getFSWrite = (state, props) => state[c.NAME]
export const getPath = (state, props) => props.path

/**
 * get the fs write entrys for a Folder
 * @param  {Object} state of the redux store
 * @param  {Object} props {path: string}
 * @returns Immuteable Map of fs write entry Objects
 */
export const getForFolderFactory = (state, props) => {
  return createSelector(
    [getFSWrite, getPath], (fsWrite, path) => {
      return fsWrite.map((entry) => {
        if(nodePath.dirname(entry.get('destination')) == path) {
          return entry
        }
      })
    }
  )
}

/**
 * get the progress objects for a folder to display progressbars 
 * @param  {Object} state of the redux store
 * @param  {Object} props {path: string}
 * @returns Immuteable Map of progress Objects
 */
export const getSubTasksForFolderFactory = (state, props) => {

  let getForFolder = getForFolderFactory()

  return createSelector(
    [getFSWrite, getPath], (fsWrite, path) => {
    let progressingFiles = []
    fsWrite.forEach((task) => {
      if(task.get('subTasks')) {
        task.get('subTasks').forEach((subTask) => {
          if(nodePath.dirname(subTask.get('destination')) == path ) {
            progressingFiles.push(subTask)
          }
        })
      }
    })
    return (progressingFiles.length > 0) ? progressingFiles : null
  })
}