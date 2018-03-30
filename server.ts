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

    // Login
    ipcMain.on("login", (event, arg) => {
        let result = knex('Users').where({
            Username: arg.username,
            Password: arg.password
        }).select('Id', 'Name', 'Username', 'PermissionType')
        result.then((res) => {
            // result is always an array
            event.returnValue = JSON.stringify(res[0])
        })
    })

    // Load Quizzes
    ipcMain.on("loadQuizzes", (event, arg) => {
        if (arg === undefined) {
            let result = knex.select('Id', 'Name', 'Description', 'PreparedBy', 'IsActive').from('Quizzes')
            result.then((quizzes) => {
                event.returnValue = JSON.stringify(quizzes)
            })
        }
    });

    ipcMain.on("loadQuiz", (event, arg) => {
        let result = knex('Quizzes').where({
            IsActive: 1,
        }).select('Id', 'Name', 'Description', 'PreparedBy', 'IsActive');

        result.then((quiz) => {
            event.returnValue = JSON.stringify(quiz[0]);
        });
    })
    ipcMain.on("loadItems", (event, arg) => {
        let items = knex('Items').where({
            QuizId: arg
        }).select('Id', 'Question', 'QuestionTypeId', 'Answer', 'QuizId', "Options")
        items.then((items) => {
            // win.webContents.send("itemList", items);

            // result is always an array
            event.returnValue = JSON.stringify(items)
        })
    })




    // Load users
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