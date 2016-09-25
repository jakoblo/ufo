import { createSelector } from 'reselect'
import * as c from './fs-write-constants'
import nodePath from 'path'

export const getFSWrite = (state, props) => state[c.NAME]
export const getPath = (state, props) => props.path

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

export const getProgressingForFolderFactory = (state, props) => {

  let getForFolder = getForFolderFactory()

  return createSelector(
    [getFSWrite, getPath], (fsWrite, path) => {
    let progressingFiles = []
    fsWrite.forEach((entry) => {
      if(entry) {
        entry.get('files').forEach((file) => {
          if(nodePath.dirname(file.get('destination')) == path ) {
            progressingFiles.push(file)
          }
        })
      }
    })
    return (progressingFiles.length > 0) ? progressingFiles : null
  })
}