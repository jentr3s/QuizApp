import { Component, OnInit } from '@angular/core'

import { SharedService } from '../../shared.service'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router'
import { PagerService } from '../../_shared';
import { NgForm } from '@angular/forms';

declare let electron: any

@Component({
  selector: 'app-manage.options',
  templateUrl: './manage.options.component.html',
  styleUrls: ['./manage.options.component.scss']
})
export class ManageOptionsComponent implements OnInit {
  // IPC Renderer
  public ipc = electron.ipcRenderer;

  isLoggedIn: boolean = false
  userInfo: any
  quizId: any
  quizName: string
  items: any[] = []

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[]

  questionType: any
  optionsForm: any
  indexNo: any
  selectedAll: boolean

  constructor(private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pagerService: PagerService) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.quizId = Number(params['quizId'])
      this.quizName = String(params['quizName'])
      this.loadOptions(this.quizId)

      // initialize to page 1
      this.setPage(1);
    })

  }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)

    this.questionType = [
      {
        id: 1,
        value: 'Multiple Choice'
      },
      {
        id: 2,
        value: 'Fill in the blank'
      }]
  }


  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.items.length, page);

    // get current page of items
    this.pagedItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  back() {
    const routeExtras: NavigationExtras = {
      queryParams: {
        'quizId': this.quizId
      }
    }

    this.sharedService.changeLoggedInUserDetail(this.userInfo)
    this.router.navigate(['manageQuiz'], routeExtras)
  }

  loadOptions(quizId) {
    const result = this.ipc.sendSync('getItems', quizId)
    this.items = JSON.parse(result)
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].Selected = false
      this.items[i].QuestionTypeId = this.items[i].QuestionTypeId == 1 ? 'Multiple Choice' : 'Fill in the blank'
      if (this.items[i].Options && this.items[i].Options !== null) {
        const options = JSON.parse(this.items[i].Options)
        this.items[i].Options = options.toString()
      }
    }
  }

  addOption() {
    this.items.push({
      Question: '',
      QuestionTypeId: '',
      Answer: '',
      QuizId: '',
      Options: ''
    })
  }
  checkAll() {
    if (!this.selectedAll) {
      this.selectedAll = true;
    } else {
      this.selectedAll = false;
    }
    this.items.forEach(item => {
      item.Selected = this.selectedAll
    })

  }

  removeOption() {
    let newDataList = []
    this.selectedAll = false

    this.items.forEach(item => {
      if (!item.Selected) {
        newDataList.push(item)
      }
    })

    this.items = newDataList;
  }

  updateOptions(items: any) {

    console.log(items)
  }

}
