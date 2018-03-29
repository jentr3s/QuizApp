import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

declare let electron: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public showMainPage: boolean = false;

  // IPC Renderer
  ipc = electron.ipcRenderer;
  quizzes: any;
  items: any;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.mainPage.subscribe(res => this.showMainPage = res);
    this.sharedService.changeMainPage(this.showMainPage);

    this.loadQuizzes()
  }

  loadQuizzes() {
    let result = this.ipc.sendSync("loadQuizzes")
    this.quizzes = JSON.parse(result);
  }

  loadItems(quizId: number) {
    let result = this.ipc.sendSync("loadItems", quizId)
    this.items = JSON.parse(result);
  }

  back() {
    this.sharedService.changeMainPage(this.showMainPage = true);

    this.router.navigate(['']);

  }

}
