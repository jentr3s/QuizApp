import { Component, OnInit } from '@angular/core'
import { SharedService } from '../../shared.service'
import { Router, ActivatedRoute } from '@angular/router'

declare let electron: any;

@Component({
  selector: 'app-manage.result',
  templateUrl: './manage.result.component.html',
  styleUrls: ['./manage.result.component.scss']
})
export class ManageResultComponent implements OnInit {

  // IPC Renderer
  public ipc = electron.ipcRenderer;

  isLoggedIn: boolean
  userInfo: any
  quizId: any
  results: Object[] = []

  constructor(private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.quizId = params['quizId'];
      this.loadQuizResult(this.quizId)
    })

  }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)
  }

  loadQuizResult(quizId) {
    const quizzes = this.ipc.sendSync('getQuizResult', quizId)
    const items = JSON.parse(quizzes)

    for (let i = 0; i < items.length; i++) {
      const answers = []
      const itemAnswers = JSON.parse(items[i].Answers)
      for (let j = 0; j < itemAnswers.length; j++) {
        answers.push(itemAnswers[j].answer)
      }
      this.results.push(
        {
          QuizId: items[i].QuizId,
          StudentName: items[i].StudentName,
          Result: items[i].Result,
          Answers: answers.toString(),
          Score: items[i].Score,
          Items: items[i].Items
        })
    }
  }

  back() {
    this.sharedService.changeIsLoggedIn(true)
    this.sharedService.changeLoggedInUserDetail(this.userInfo)
    this.router.navigate(['settings'])
  }

}
