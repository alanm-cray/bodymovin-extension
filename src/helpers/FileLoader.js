import csInterface from './CSInterfaceHelper'
import {getSeparator} from './osHelper'
import fs from './fs_proxy'

function loadBodymovinFileData(path) {
    var reject, resolve
    var promise = new Promise(function(_resolve, _reject) {
        resolve = _resolve
        reject = _reject
    })
    try {
        var result = window.cep.fs.readFile(path);
        if(result.err === 0) {
            var jsonData = JSON.parse(result.data);
            if (jsonData.v || jsonData.version) {
                resolve(jsonData);
            } else {
                reject()
            }
	    } else {
            reject()
        }
    } catch(err) {
        reject()
    }

    return promise
}

function loadArrayBuffer(path) {
    return new Promise(function(resolve, reject) {
            try {
                var result = window.__fs.readFileSync(path)
                resolve(result.buffer)
            } catch(err) {
                reject()
            }
    })
}

export default loadBodymovinFileData

async function loadFileData(path) {
    var extensionPath = csInterface.getSystemPath('extension');
    var fileStats = fs.statSync(extensionPath +  getSeparator() + path)
    return Promise.resolve(fileStats)
    
}

const _localPaths = {}

function getLocalPath(key) {
    return _localPaths[key] || '';
}

function setLocalPath(key, value) {
    _localPaths[key] = value;
}

async function downloadFile(url, path) {
    const res = await fetch(url);

    const arrayBuf = await res.arrayBuffer()
    return new Promise((resolve, reject) => {
        fs.writeFile(path, Buffer.from(arrayBuf), (error, data) => {
            if(error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

async function saveFileFromBase64(data, path) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, 'base64', (error, data) => {
            if(error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

async function createFolder(path, folderName) {
    if (!fs.existsSync(path + folderName)){
        fs.mkdirSync(path + folderName);
    }
}

export {
    loadFileData,
    getLocalPath,
    setLocalPath,
    downloadFile,
    saveFileFromBase64,
    createFolder,
    loadArrayBuffer,
}