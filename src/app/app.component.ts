import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public showHeader: boolean = true;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.header.subscribe(res => this.showHeader = res);
    this.sharedService.changeHeader(this.showHeader);
  }

  sendToSettings() {
    this.sharedService.changeHeader(this.showHeader = false);
    this.router.navigate(['settings']);
  }

  launchQuiz() {
    this.sharedService.changeHeader(this.showHeader = false);
    this.router.navigate(['']);
  }
}
