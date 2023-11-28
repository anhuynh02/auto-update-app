const { app, autoUpdater, dialog } = require('electron');

// Specify the URL of the update server
const server = 'https://update.electronjs.org/your-username/your-repo';
const url = `${server}/update/${process.platform}/${app.getVersion()}`;

// Set the update feed URL
autoUpdater.setFeedURL({ url });

// Check for updates every 10 minutes
setInterval(() => {
  autoUpdater.checkForUpdates();
}, 600000);

// Handle update-downloaded event
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

// Handle error event
autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application');
  console.error(message);
});