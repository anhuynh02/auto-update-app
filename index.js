const { app, BrowserWindow , ipcMain, dialog } = require("electron");
const { updateElectronApp } = require('update-electron-app')
const path = require("path");
updateElectronApp()
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});



process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
