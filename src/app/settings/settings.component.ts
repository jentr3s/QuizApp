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

  // IPC Renderer
  public ipc = electron.ipcRenderer;
  userInfo: any;
  isLoggedIn: boolean;

  // Model username and password
  username: string;
  password: string;

  quizList: any = [];

  showMainPage: boolean = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res);
  }

  login() {
    let data = { username: this.username, password: this.password };

    let loggedInUser = this.ipc.sendSync("login", data)
    this.userInfo = JSON.parse(loggedInUser);

    if (this.userInfo != null) {
      this.isLoggedIn = true;
      this.sharedService.changeIsLoggedIn(true);
      this.sharedService.changeLoggedInUserDetail(this.userInfo);

      this.loadQuizzes();
    }
    else {
      console.log("Failed to login!");
    }
  }

  logout() {
    this.sharedService.changeMainPage(this.showMainPage = true);
    this.sharedService.changeIsLoggedIn(false);
    this.sharedService.changeLoggedInUserDetail(this.userInfo = null);
    this.router.navigate(['']);
  }

  cancel(){
    this.sharedService.changeMainPage(this.showMainPage = true);
    this.router.navigate(['']);
  }

  loadQuizzes() {
    let quizzes = this.ipc.sendSync("loadQuizzes")
    let result = JSON.parse(quizzes);
    if (result != null)
      this.loadItems(result);
  }

  loadItems(quizzes) {
    for (var i = 0; i < quizzes.length; i++) {
      var itemCount = 0;
      var id = quizzes[i].Id;

      let items = this.ipc.sendSync("loadItems", id)
      let result = JSON.parse(items);

      console.log(result);

      if (items.length !== 0) {
        itemCount = items.length;
      }

      this.quizList.push({ Quiz: quizzes[i], ItemCount: itemCount });
    }
  }
}
