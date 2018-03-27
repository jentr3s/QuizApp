import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

declare let electron: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public showSettingsPage: boolean = false;
  public ipc = electron.ipcRenderer;

  // Model username and password
  username: string;
  password: string;
  userDetail = null;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }

  login() {
    let log = this;
    let data = { username: this.username, password: this.password };

    log.ipc.send("login", data)

    // this method listens to insertOptions
    log.ipc.on("userDetails", (evt, result) => {
      this.userDetail = result;
      console.log(this.userDetail);

      if (this.userDetail != null) {
        this.sharedService.changeMainPage(this.showSettingsPage = true);
        this.loadQuizzes();

      }
      else {
        console.log("Failed to login!");
      }

    })
  }

  loadQuizzes() {
    // Load user details
    let quiz = this;
    quiz.ipc.send("loadQuizzes")

    // this method listens to userList
    quiz.ipc.on("quizzesList", (evt, result) => {
      console.log(result);
    });

  }
}
