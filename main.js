/*
 * @Author: your name
 * @Date: 2021-01-12 16:25:43
 * @LastEditTime: 2021-01-13 16:54:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-quick-start\main.js
 */
// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')


const { autoUpdater } = require('electron-updater');
// 不支持 ES6 则用如下方式引入
// const autoUpdater = require("electron-updater").autoUpdater
 
// 更新包的位置
const feedUrl = 'http://10.11.24.129/update/win32';

// const server = 'http://10.11.24.129'
// const url = `${server}/update/${process.platform}/ ${app.getVersion()}`

// autoUpdater.setFeedURL({ url })

// console.log('server', server)
// console.log('url', url)
// console.log('app', autoUpdater.getFeedURL())

// setInterval(() => {
//   console.log('检查自动更新')
//   autoUpdater.checkForUpdates()
// }, 1000)

let webContents

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  webContents = mainWindow.webContents

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail: 'A new version has been downloaded. 重启应用程序来应用更新。'
//   }

//   dialog.showMessageBox(dialogOpts).then((returnValue) =>{
//     if(returnValue.response === 0) {
//       autoUpdater.quitAnd()
//     }
//   })
// })

// autoUpdater.on('error', message => {
//   console.error('There was a problem updating the application')
//   console.error(message)
// })


// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  checkForUpdates();
});

let checkForUpdates = () => {
// 配置安装包远端服务器
  autoUpdater.setFeedURL(feedUrl);

// 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function(message) {
      sendUpdateMessage('error', message);
  });
  autoUpdater.on('checking-for-update', function(message) {
      sendUpdateMessage('checking-for-update', message);
  });
  autoUpdater.on('update-available', function(message) {
      sendUpdateMessage('update-available', message);
  });
  autoUpdater.on('update-not-available', function(message) {
      sendUpdateMessage('update-not-available', message);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
      sendUpdateMessage('downloadProgress', progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      sendUpdateMessage('isUpdateNow');
      ipcMain.on('updateNow', (e, arg) => {
          autoUpdater.quitAndInstall();
      });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  console.log({ message, data });
  webContents.send('message', { message, data });
}