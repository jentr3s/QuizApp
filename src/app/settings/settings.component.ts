import { Component, OnInit } from '@angular/core';
declare let electron: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public ipc = electron.ipcRenderer;

  username: string;
  password: string;

  constructor() { }

  ngOnInit() {
  }

  login() {
    let log = this;
    let userDetail = null;
    let data = { username: this.username, password: this.password };

    log.ipc.send("login", data)

    // this method listens to insertOptions
    log.ipc.on("userDetails", (evt, result) => {
      userDetail = result;
      console.log(userDetail);
    });

    if (userDetail != null) {
      console.log('hey its null');
    }
  }
}
