const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let win

const docPath = app.getPath('documents')

//Local connection only
let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: docPath + '/QuizAppDb/DbQuizApp'
    },
    useNullAsDefault: true
})

function createWindow() {
    win = new BrowserWindow({
        width: 850,
        height: 600,
        icon: path.join(__dirname, 'assets/icons/png/quiz-app.png')
    })

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
            .then((res) => {
                // result is always an array
                event.returnValue = JSON.stringify(res[0])
            })
            .catch((err) => {
                event.returnValue = JSON.stringify('error')
            })
    })

    // Load Quizzes
    ipcMain.on("getQuizzes", (event, arg) => {
        if (arg === undefined) {
            let result = knex.select('Id', 'Name', 'Description', 'PreparedBy', 'IsActive').from('Quizzes')
            result.then((quizzes) => {
                event.returnValue = JSON.stringify(quizzes)
            })
            result.catch((err) => {
                event.returnValue = JSON.stringify('error')
            })
        }
    })

    // Load Quiz
    ipcMain.on("getQuiz", (event, arg) => {
        let result = knex('Quizzes').where({
            IsActive: 1,
        }).select('Id', 'Name', 'Description', 'PreparedBy', 'IsActive')
        result.then((quiz) => {
            event.returnValue = JSON.stringify(quiz[0])
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })

    })

    // Load Items
    ipcMain.on("getItems", (event, arg) => {
        let items = knex('Items').where({
            QuizId: arg
        }).select('Id', 'Question', 'QuestionTypeId', 'Answer', 'QuizId', 'Options')
        items.then((data) => {
            // result is always an array
            event.returnValue = JSON.stringify(data)
        })
        items.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

     // Load Quiz Result
     ipcMain.on("getQuizResult", (event, arg) => {
        let results = knex('QuizResults').where({
            QuizId: arg
        }).select('Id', 'QuizId', 'StudentName', 'Result', 'Answers', 'Score', 'Items')
        results.then((data) => {
            // result is always an array
            event.returnValue = JSON.stringify(data)
        })
        results.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

    // Insert Quiz Result
    ipcMain.on("putQuizResult", (event, arg) => {
        let result = knex.insert(arg).into('QuizResults')
        result.then((id) => {
            event.returnValue = JSON.stringify(id)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

    // Load users
    ipcMain.on("getUsers", (event, arg) => {
        let result = knex.select('Name').from('Users')
        result.then((rows) => {
            win.webContents.send('users', rows)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

    // Insert Options
    ipcMain.on("putOptions", (event, arg) => {
        let result = knex.insert(arg).into("Options")
        result.then(function (id) {
            win.webContents.send('insertedId', id)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

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