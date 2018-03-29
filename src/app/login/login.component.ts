import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
declare let electron: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public ipc = electron.ipcRenderer;
  userInfo: any;

  // Model username and password
  username: string;
  password: string;

  public showMainPage: boolean;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
  }


  login() {
    let log = this;
    let data = { username: this.username, password: this.password };

    log.ipc.send("login", data)

    // this method listens to insertOptions
    log.ipc.on("userDetails", (evt, result) => {
      this.userInfo = result[0];
    })
    
    if (this.userInfo != null) {
      this.sharedService.changeLoggedInUserDetail(this.userInfo);
      this.router.navigate(['settings']);
    }
    else {
      console.log("Failed to login!");
    }

  }

}
