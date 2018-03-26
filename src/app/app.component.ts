import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public showMainPage: boolean = true;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.mainPage.subscribe(res => this.showMainPage = res);
    this.sharedService.changeMainPage(this.showMainPage);
  }

  sendToSettings() {
    this.sharedService.changeMainPage(this.showMainPage = false);
    this.router.navigate(['settings']);
  }

  launchQuiz() {
    this.sharedService.changeMainPage(this.showMainPage = false);
    this.router.navigate(['']);
  }
}
