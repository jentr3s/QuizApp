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
        this.items[i].Options = this.items[i].Options
      }
    }
  }

  addOption() {
    this.items.push({
      Question: '',
      QuestionTypeId: '',
      Answer: '',
      QuizId: this.quizId,
      Options: null
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
    const forUpdate: any[] = []
    const forInsert: any[] = []

    // Deep copy
    let newItems = JSON.parse(JSON.stringify(this.items))

    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].QuestionTypeId === 'Multiple Choice') {
        newItems[i].QuestionTypeId = 1
      } else {
        newItems[i].QuestionTypeId = 2
      }

      if (newItems[i].Id) {
        forUpdate.push(newItems[i])
      } else {
        forInsert.push(newItems[i])
      }

    }
    if (forInsert.length > 0) {
      const insertResult = this.ipc.sendSync('postOptions', forInsert)
      console.log(JSON.parse(insertResult))
    }
    if (forUpdate.length > 0) {
      for (let i = 0; i < forUpdate.length; i++) {
        const model = {
          Id: forUpdate[i].Id,
          Question: forUpdate[i].Question,
          QuestionTypeId: forUpdate[i].QuestionTypeId,
          Answer: forUpdate[i].Answer,
          QuizId: forUpdate[i].QuizId,
          Options: forUpdate[i].Options
        }

        const updateResult = this.ipc.sendSync('putOptions', model)
        console.log(JSON.parse(updateResult))
      }
    }
  }

}
