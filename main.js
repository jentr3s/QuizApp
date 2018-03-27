const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let win

let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: './src/server/scripts/DbQuizApp'
  }
});

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 })

  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // database connection
  // let connectToServer = require('./src/server/server.js');

  // Open the DevTools optionally:
  // win.webContents.openDevTools()

  ipcMain.on("mainWindowLoaded", function () {
    let result = knex.select("Name").from("Users")
    result.then(function (rows) {
      win.webContents.send("userList", rows);
    })
  });

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})