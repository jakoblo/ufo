import { createSelector } from 'reselect'
import * as c from './fs-write-constants'
import nodePath from 'path'

export const getFSWrite = (state, props) => state[c.NAME]
export const getProps = (state, props) => props

export const getForFolderFactory = (state, props) => {
  return createSelector(
    [getFSWrite, getProps], (fsWrite, props) => {
      return fsWrite.map((entry) => {
        if(nodePath.dirname(entry.get('destination')) == props.path) {
          return entry
        }
      })
    }
  )
}

export const getProgressingForFolderFactory = (state, props) => {

  let getForFolder = getForFolderFactory()

  return createSelector(
    [getForFolder, getProps], (entryForFolder, props) => {
    let progressingFiles = []
    entryForFolder.forEach((entry) => {
      if(entry) {
        entry.get('files').forEach((file) => {
          if(nodePath.dirname(file.get('destination')) == props.path ) {
            progressingFiles.push(file)
          }
        })
      }
    })
    return progressingFiles
  })
}