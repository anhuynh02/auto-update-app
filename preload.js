const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  updateMessage: (callback) => ipcRenderer.on("updateMessage", callback),
})
