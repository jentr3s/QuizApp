import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router, NavigationExtras } from '@angular/router';

declare let electron: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // IPC Renderer
  public ipc = electron.ipcRenderer;

  userInfo: any
  isLoggedIn: boolean
  loginBtnClick: boolean = false

  // Model username and password
  username: string
  password: string

  quizList: any = []
  quizResult: any = []

  showMainPage: boolean = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)

    if (this.isLoggedIn) {
      this.loadQuizzes()
    }
  }

  // Funtions
  login() {
    const data = { username: this.username, password: this.password }

    const loggedInUser = this.ipc.sendSync('login', data)
    this.userInfo = JSON.parse(loggedInUser)
    this.loginBtnClick = true;

    if (this.userInfo != null && this.userInfo !== 'error') {
      this.isLoggedIn = true
      this.sharedService.changeIsLoggedIn(true)
      this.sharedService.changeLoggedInUserDetail(this.userInfo)

      this.loadQuizzes()
    } else {
      console.log('Failed to login!');
    }
  }

  logout() {
    // Display main page
    this.sharedService.changeMainPage(this.showMainPage = true)
    this.sharedService.changeIsLoggedIn(false)
    this.sharedService.changeLoggedInUserDetail(this.userInfo = null)
    this.router.navigate([''])
  }

  cancel() {
    // Display main page
    this.sharedService.changeMainPage(this.showMainPage = true)
    this.router.navigate([''])
  }

  addQuiz() {
    this.sharedService.changeLoggedInUserDetail(this.userInfo)
    this.router.navigate(['manageQuiz'])
  }

  viewResult(id) {
    const routeExtras: NavigationExtras = {
      queryParams: {
        'quizId': id
      }
    }
    this.sharedService.changeLoggedInUserDetail(this.userInfo)
    this.router.navigate(['manageResult'], routeExtras)
  }

  // Load Data
  loadQuizzes() {
    const quizzes = this.ipc.sendSync('getQuizzes')
    const result = JSON.parse(quizzes)
    if (result != null) {
      this.loadItems(result)
      this.loadQuizResult(result)
    }
  }

  loadItems(quizzes) {
    for (let i = 0; i < quizzes.length; i++) {
      let itemCount = 0
      const id = quizzes[i].Id

      const items = this.ipc.sendSync('getItems', id)
      const result = JSON.parse(items)

      if (result.length !== 0) {
        itemCount = result.length
      }

      this.quizList.push({ Quiz: quizzes[i], ItemCount: itemCount })
    }
  }

  loadQuizResult(quizzes) {
    for (let i = 0; i < quizzes.length; i++) {
      let studCount = 0
      const id = quizzes[i].Id

      const items = this.ipc.sendSync('getQuizResult', id)
      const result = JSON.parse(items)

      if (result !== null) {
        for (let j = 0; j < result.length; j++) {
          if (result[j].QuizId === quizzes[i].Id) {
            studCount++
          }
        }
      }
      this.quizResult.push({ Quiz: quizzes[i], StudentCount: studCount })
    }
  }
}
