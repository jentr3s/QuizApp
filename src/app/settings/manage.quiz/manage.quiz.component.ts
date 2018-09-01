import { Component, OnInit } from '@angular/core'
import { SharedService } from '../../shared.service'
import { Router, ActivatedRoute } from '@angular/router'

declare let electron: any;

@Component({
  selector: 'app-manage.quiz',
  templateUrl: './manage.quiz.component.html',
  styleUrls: ['./manage.quiz.component.scss']
})
export class ManageQuizComponent implements OnInit {

  // IPC Renderer
  public ipc = electron.ipcRenderer;

  isLoggedIn: boolean = false
  userInfo: any
  isCreate: boolean = false
  quizId: any
  quiz: any

  constructor(private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.quizId = Number(params['quizId'])
      this.isCreate = params['isCreateQuiz'] === 'true' ? true : false
    })

    if (!this.isCreate) {
      this.loadQuizzes(this.quizId)
    }
  }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)
  }

  back() {
    this.sharedService.changeIsLoggedIn(true)
    this.sharedService.changeLoggedInUserDetail(this.userInfo)
    this.router.navigate(['settings'])
  }

  // Load Data
  loadQuizzes(id) {
    const quiz = this.ipc.sendSync('getQuizById', id)
    const quizObj = JSON.parse(quiz)

    quizObj.IsActive = quizObj.IsActive === 1 ? true : false
    this.quiz = quizObj
  }

  // Update Quiz
  updateQuiz(quiz) {
    // const quizModel = {
    //   Id: this.quizId,
    //   Name: quiz.Name,
    //   Description: quiz.Description,
    //   PreparedBy: quiz.PreparedBy,
    //   IsActive: quiz.IsActive === true ? 1 : 0
    // }

    // const result = this.ipc.sendSync('putQuiz', quizModel)
    // console.log(result)
    console.log(quiz)
  }

}
