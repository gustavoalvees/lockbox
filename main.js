const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,

    webPreferences: {
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setMaximizable(false)
  mainWindow.setResizable(false)
  mainWindow.loadFile('index.html')
}

app.on('ready', () => {  
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
