const electron = require('electron')
const app = electron.app

const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow(  {
    width: 1024,
    height: 768,
    frame: false,
    icon: __dirname + '/app.ico',
    webPreferences: {
      //devTools: false
    }
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.maximize()

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
