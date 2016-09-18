import {ipcRenderer} from 'electron'
import nodePath from 'path'
import trash from 'trash'
import {fork} from 'child_process'
import * as c from './fs-write-constants'

export function moveToTrash(sources) {
  trash(sources)
}

export function move(sources, targetFolder, options) {
  createFsWorker(sources, targetFolder, {...options, move: true})
}

export function copy(sources, targetFolder, options) {
  createFsWorker(sources, targetFolder, {...options, move: false})
}

function createFsWorker(sources, targetFolder, options) {
  sources.forEach((source) => {
    let destination = nodePath.join(targetFolder, nodePath.basename(source)) 
    if(source != destination) {
      handleFsWorker(source, destination, options)
    }
  })
}

function handleFsWorker(source, destination, options) {

  var fsWriteWorker = fork(__dirname + '/child-worker/fs-write-worker.js');

  fsWriteWorker.send({
    source: source,
    dest: destination,
    options
  });

  fsWriteWorker.on('message', function(response) {

    console.log(response)
    
    switch (response.type) {

      case c.CHILD_LOG:
        return

      case c.CHILD_PROGRESS:
        return
      
      case c.CHILD_ERR:
        fsWriteWorker.kill()
        return

      case c.CHILD_DONE:
        fsWriteWorker.kill() 
        return
    }
  });
}