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
  userInfo = [];
  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.sharedService.loginUser.subscribe(res => this.userInfo = res[0]);
    this.sharedService.changeLoginValue(this.userInfo);

    this.sharedService.test.subscribe(res => console.log("test: " + res));
    
    
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
}
