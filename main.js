const { app,BrowserWindow , ipcMain, autoUpdater, dialog } = require('electron')
const path = require("path")
const server = 'https://auto-update-app-agxu.vercel.app'
const url = `${server}/update/${process.platform}/${app.getVersion()}`


function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {

      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  autoUpdater.setFeedURL({ url })
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })
  autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
  })
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
