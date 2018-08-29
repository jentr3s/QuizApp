import { Component, OnInit } from '@angular/core'
import { SharedService } from '../../shared.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-manage.quiz',
  templateUrl: './manage.quiz.component.html',
  styleUrls: ['./manage.quiz.component.scss']
})
export class ManageQuizComponent implements OnInit {

  isLoggedIn: boolean
  userInfo: any

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)
  }

  back() {
    this.sharedService.changeIsLoggedIn(true)
    this.sharedService.changeLoggedInUserDetail(this.userInfo)
    this.router.navigate(['settings'])
  }

}
