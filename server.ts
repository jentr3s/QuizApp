const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let win

const docPath = app.getPath('documents')

//Local connection only
let knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: docPath + '/QuizAppDb/DbQuizApp'
    },
    useNullAsDefault: true
})

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
    })

    // load the dist folder from Angular
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools optionally:
    // win.webContents.openDevTools()

    ////////////////////////////// USER /////////////////////////////
    // Login
    ipcMain.on('login', (event, arg) => {
        let result = knex('Users').where({
            Username: arg.username,
            Password: arg.password
        }).select('Id', 'Name', 'Username', 'PermissionType')
        result.then((res) => {
            // result is always an array
            event.returnValue = JSON.stringify(res)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

    // Load users
    ipcMain.on('getUsers', (event, arg) => {
        let result = knex.select('Name').from('Users')
        result.then((rows) => {
            win.webContents.send('users', rows)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })
    ////////////////////////////// END USER /////////////////////////////

    ////////////////////////////// QUIZZES /////////////////////////////
    // Load Quizzes
    ipcMain.on('getQuizzes', (event, arg) => {
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

    // Load QuizByIsActive = true
    ipcMain.on('getActiveQuiz', (event, arg) => {
        let result = knex('Quizzes').where({
            IsActive: 1,
        }).select('Id', 'Name', 'Description', 'PreparedBy', 'IsActive')
        result.then((quiz) => {
            event.returnValue = JSON.stringify(quiz)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })

    })

    // Load QuizById
    ipcMain.on('getQuizById', (event, arg) => {
        let result = knex('Quizzes').where({
            Id: arg,
        }).select('Id', 'Name', 'Description', 'PreparedBy', 'IsActive')
        result.then((quiz) => {
            event.returnValue = JSON.stringify(quiz)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })

    })

    // Load Quiz Result
    ipcMain.on('getQuizResult', (event, arg) => {
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
    ipcMain.on('postQuizResult', async (event, arg) => {
        let result = await knex.insert(arg).into('QuizResults')
        result.then((id) => {
            event.returnValue = JSON.stringify(id)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

    // Insert Quiz
    ipcMain.on('postQuiz', async (event, arg) => {
        let result = await knex.insert(arg).into('Quizzes');
        result.then((id) => {
            event.returnValue = JSON.stringify(id)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })

    // Update QuizById
    ipcMain.on('putQuiz', (event, arg) => {
        console.log(arg)
        let result = knex('Quizzes').where('Id', '=', arg.Id).update(arg)
        result.then((res) => {
            event.returnValue = JSON.stringify(res)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })
    ////////////////////////////// END QUIZZES /////////////////////////////

    ////////////////////////////// ITEMS ///////////////////////////////////
    // Load Items
    ipcMain.on('getItems', (event, arg) => {
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

    ////////////////////////////// END ITEMS ///////////////////////////////////

    ////////////////////////////// OPTION ///////////////////////////////////
    // Insert Options
    ipcMain.on('postOptions', async (event, arg) => {
        try {
            let result = await knex('Items').insert(arg)
            event.returnValue = JSON.stringify(result)
        } catch (ex) {
            console.log(ex)
            event.returnValue = JSON.stringify(ex)
        }
    })

    // Update Options
    ipcMain.on('putOptions', (event, arg) => {
        let result = knex('Items').where('Id', '=', arg.Id).update(arg)
        result.then((id) => {
            event.returnValue = JSON.stringify(id)
        })
        result.catch((err) => {
            event.returnValue = JSON.stringify('error')
        })
    })
    ////////////////////////////// END OPTION ////////////////////////////////

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