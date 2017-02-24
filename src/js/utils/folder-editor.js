import fs from 'fs';

export function saveFileToDisk(basePath, data) {
    fs.writeFile(basePath + "/ufo.json", data, function (err) {
        if (err) {
            return false
        }
        return true
    });
}

export function loadFilefromDisk(basePath) {
    fs.writeFile(basePath + "/ufo.json", data, function (err) {
        if (err) {
            return false
        }
        return true
    });

    fs.readFile(basePath + '/ufo.json', (err, data) => {
        if (err) throw err;
        console.log(data);
    });

}