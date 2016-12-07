import {ncp} from 'graceful-ncp'


  function copy(subTask, errCallback, doneCallback) {
    if (subTask.clobber) {
      rimraf(subTask.destination, { disableGlob: true }, (err) => {
        if (err) return errCallback(err, task);
        startNcp();
      });
    } else {
      startNcp(subTask);
    }

    function startNcp(subTask) {
      var ncpOptions = {
        stopOnErr: true,
        clobber: false,
        limit: 8,
        transform: (read, write) => {
          var str = progress({
            length: fs.statSync(read.path).size,
            time: 700
          });
          str.on('progress', (progress) => {
            window.store.dispatch({
              type: t.FS_WRITE_PROGRESS,
              payload: {
                id: id,
                file: {
                  source: read.path,
                  destination: write.path,
                  progress: progress}
              }
            })
          })
          read.pipe(str).pipe(write)
          console.log(read)
        } 
      };

      ncp(subTask.source, subTask.destination, ncpOptions, (errList) => {
        if (errList) {return errCallback(errList[0], task);}
        if(subTask.type == t.TASK_MOVE) {
          rimraf(type.source, { disableGlob: true }, (err) => {
            if(err) {errCallback(err, task); return}
            doneCallback()
          });
        } else {
          doneCallback()
        }
      });
    }
  }
