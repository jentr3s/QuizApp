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

    // Open the DevTools optionally:
    // win.webContents.openDevTools()

    ipcMain.on("login", (event, arg) => {
        let result = knex('Users').where({
            Username: arg.username,
            Password: arg.password
        }).select('Name', 'PermissionType')
        result.then((res) => {
            win.webContents.send("userDetails", res[0]);
        })
    })

    ipcMain.on("loadUsers", () => {
        let result = knex.select("Name").from("Users")
        result.then((rows) => {
            win.webContents.send("userList", rows);
        })
    });

    ipcMain.on("insertInOptions", (event, arg) => {
        let result = knex.insert(arg).into("Options")
        result.then(function (id) {
            win.webContents.send("insertedId", id);
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