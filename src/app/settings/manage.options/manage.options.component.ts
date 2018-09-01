import { Component, OnInit } from '@angular/core'

import { SharedService } from '../../shared.service'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router'

declare let electron: any

@Component({
  selector: 'app-manage.options',
  templateUrl: './manage.options.component.html',
  styleUrls: ['./manage.options.component.scss']
})
export class ManageOptionsComponent implements OnInit {

  isLoggedIn: boolean = false
  userInfo: any
  quizId: any

  constructor(private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.quizId = Number(params['quizId'])

      this.loadOptions(this.quizId)
    })

  }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)
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

  loadOptions(id) { }

}
