import fs from 'mz/fs'
import nodePath from 'path'
import * as c from './fs-write-constants'


export function verifyAccess (source, destination, move, clobber = false) {

  const sourcePermissions = (move) ? fs.constants.W_OK : fs.constants.R_OK || fs.constants.W_OK
  const destPermissions = fs.constants.W_OK
  
  return new Promise( function(resolve, reject) {
    fs.access(source, sourcePermissions) // Can Read Source? 
      .then( () => {
          fs.access(nodePath.dirname(destination), fs.constants.W_OK)  // Can Write Target Parent?
            .then( () => {
              fs.access(destination, fs.constants.W_OK) // does the Target already exists?
                .then( () => {
                  if(clobber) {
                    resolve() // im allowed to overwrite the existing destionation
                  } else {
                    reject({  // not allowed to overwrite
                      code: c.ERROR_DEST_ALREADY_EXISTS
                    })
                  }
                })
                .catch((err) => {
                  if(err.code == c.ERROR_NOT_EXISTS) 
                  { resolve() } // Destination does not exists -> free space -> go
                  else 
                  { reject(err) } // No write access or something like that
                })
            })
            .catch(reject)  // can not read/write destination dir
        })
      .catch(reject) // can not read the source
  })
}

export function noMoveInItSelf (source, destination, move) {
  return new Promise( function(resolve, reject) {
    if(!move) { resolve() } // Copy initself is allowed
    
    if(destination.indexOf(source) > -1) {
      reject({code: c.ERROR_MOVE_IN_IT_SELF})
    } else {
      resolve()
    }
  })
}  

