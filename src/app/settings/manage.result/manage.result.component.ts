import { Component, OnInit } from '@angular/core'
import { SharedService } from '../../shared.service'
import { Router, ActivatedRoute } from '@angular/router'
import { PagerService } from '../../_shared/index';

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
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pagerService: PagerService) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.quizId = params['quizId'];
      this.loadQuizResult(this.quizId)

      // initialize to page 1
      this.setPage(1);
    })

  }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.results.length, page);

    // get current page of items
    this.pagedItems = this.results.slice(this.pager.startIndex, this.pager.endIndex + 1);
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
