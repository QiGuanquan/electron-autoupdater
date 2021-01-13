// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {ipcRenderer} = require('electron')

var _ol = document.getElementById("content");
ipcRenderer.on('message',(event,{message,data}) => {
    let _li = document.createElement("li");
    _li.innerHTML = message + " <br>data:" + JSON.stringify(data) +"<hr>";
    _ol.appendChild(_li);
    if (message === 'isUpdateNow') {
        if (confirm('是否现在更新？')) {
            ipcRenderer.send('updateNow');
        }
    }
});


document.getElementById('updateBtn').addEventListener('click', autoUpdate)
function autoUpdate() {
    ipcRenderer.send('update');
  }
