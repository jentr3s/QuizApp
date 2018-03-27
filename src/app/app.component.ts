import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
declare let electron: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public showMainPage: boolean = true;
  public title = 'my app';
  public ipc = electron.ipcRenderer;
  public list: Array<string>;

  constructor(private router: Router, private sharedService: SharedService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.sharedService.mainPage.subscribe(res => this.showMainPage = res);
    this.sharedService.changeMainPage(this.showMainPage);

    // Load user details
    let me = this;
    me.ipc.send("loadUsers")

    // this method listens to userList
    me.ipc.on("userList", function (evt, result) {
      me.list = [];
      for (var i = 0; i < result.length; i++) {
        me.list.push(result[i].Name.toString());
      }
      me.ref.detectChanges()
    });

  }

  sendToSettings() {
    this.sharedService.changeMainPage(this.showMainPage = false);
    this.router.navigate(['settings']);
  }

  launchQuiz() {
    this.sharedService.changeMainPage(this.showMainPage = false);
    this.router.navigate(['']);
  }

  insertInOptions() {
    // Load user details
    let opt = this;
    opt.ipc.send("insertInOptions")

    // this method listens to insertOptions
    opt.ipc.on("insertedId", function (evt, result) {
      console.log(result);
      opt.ref.detectChanges()
    });

  }
}
