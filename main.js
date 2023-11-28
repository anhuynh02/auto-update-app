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

// Set up auto-updater
app.whenReady().then(() => {
  createWindow();
  console.log(app.app.getVersion())
  // Set the feed URL for auto-updater
  autoUpdater.setFeedURL(url);

  // Check for updates every 10 seconds
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 10000);

  // Event: Update downloaded
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    // Display a dialog to prompt the user to restart and apply updates
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });

  // Event: Error in auto-updater
  autoUpdater.on('error', (error) => {
    console.error('Error updating the application:', error);
  });

  // Handle window activation
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle window closure
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

