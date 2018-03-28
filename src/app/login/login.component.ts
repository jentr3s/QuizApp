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
  userInfo = [];

  // Model username and password
  username: string;
  password: string;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.loginUser.subscribe(res => this.userInfo = res);
    this.sharedService.changeLoginValue(this.userInfo);
  }


  login() {
    let log = this;
    let data = { username: this.username, password: this.password };

    log.ipc.send("login", data)

    // this method listens to insertOptions
    log.ipc.on("userDetails", (evt, result) => {
      if (result.length > 0) {
        this.userInfo.push(result);
        this.sharedService.changeLoginValue(this.userInfo);
        this.sharedService.changeTest(true);

        this.router.navigate(['settings']);
      }
      else {
        console.log("Failed to login!");
      }

    })
  }

}
