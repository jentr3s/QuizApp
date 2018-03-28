import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

declare let electron: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public ipc = electron.ipcRenderer;
  userInfo: any;

  // Model username and password
  username: string;
  password: string;
  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.sharedService.loginUser.subscribe(res => this.userInfo = res);

    console.log("logged in? :" + this.userInfo);
  }

  loadQuizzes() {
    // Load quizzes
    let quiz = this;
    let quizList = [];
    quiz.ipc.send("loadQuizzes")

    // this method listens to userList
    quiz.ipc.on("quizzesList", (evt, quizzes) => {
      this.loadItems(quizzes);
    });

  }

  loadItems(quizzes) {
    let quiz = this;
    let quizList = [];
    for (var i = 0; i < quizzes.length; i++) {
      var itemCount = 0;
      var id = quizzes[i].Id;
      quiz.ipc.send("loadItems", id)
      quiz.ipc.on("itemList", (evt, items) => {
        if (items.length !== 0) {
          itemCount = items.length;
          console.log(items);
        }
      })

      quizList.push({ Quiz: quizzes[i], ItemCount: itemCount });
    }
    // console.log(quizList);
  }

  changeIsMainPage() {
    this.sharedService.changeMainPage(true);
  }

  showPage(data: boolean)
  {
    this.sharedService.changeIsLoginValue(true);

  }
  hidePage(data: boolean)
  {
    this.sharedService.changeIsLoginValue(false);

  }
}
