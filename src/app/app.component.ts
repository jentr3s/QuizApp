import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // public showMainPage: boolean = true;
  // public ipc = electron.ipcRenderer;
  // public list: Array<string>;

  constructor(
    // private router: Router, private sharedService: SharedService, private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Load user details
    // let me = this;
    // me.ipc.send("loadUsers")

    // // this method listens to userList
    // me.ipc.on("userList", (evt, result) => {
    //   me.list = [];
    //   for (var i = 0; i < result.length; i++) {
    //     me.list.push(result[i].Name.toString());
    //   }
    //   me.ref.detectChanges()
    // });
  }
}
