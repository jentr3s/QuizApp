import { Component, OnInit } from '@angular/core'
import { SharedService } from '../../shared.service'
import { Router } from '@angular/router'
declare let electron: any

@Component({
  selector: 'app-manage.user',
  templateUrl: './manage.user.component.html',
  styleUrls: ['./manage.user.component.scss']
})
export class ManageUserComponent implements OnInit {

  // IPC Renderer
  public ipc = electron.ipcRenderer;

  isLoggedIn: boolean = false
  userInfo: any
  showAlertSuccess: boolean = false
  showAlertError: boolean = false
  permissionTypes: any = [{
    id: 101,
    value: 'Admin'
  },
  {
    id: 102,
    value: 'User'
  }]

  constructor(private sharedService: SharedService,
    private router: Router) { }

  ngOnInit() {
    this.sharedService.loggedIn.subscribe(res => this.isLoggedIn = res)
    this.sharedService.loginUser.subscribe(res => this.userInfo = res)

    this.userInfo.PermissionType = this.userInfo.PermissionType === 101 ? 'Admin' : 'User'
  }

  back() {
    this.sharedService.changeIsLoggedIn(true)
    this.sharedService.changeLoggedInUserDetail(this.userInfo)
    this.router.navigate(['settings'])
  }

  updateUser(user: any) {
    // Deep copy
    const copyUser = JSON.parse(JSON.stringify(user))

    copyUser.PermissionType = copyUser.PermissionType === 'Admin' ? 101 : 102
    const result = this.ipc.sendSync('putUser', copyUser)
    console.log(result)
    const res = JSON.parse(result)
    if (res && res !== 'error') {
      console.log('success!')
      this.showAlertSuccess = true
      setTimeout(() => {
        document.getElementById('fadeSuccess').className = 'fadeOut'
        this.showAlertSuccess = false
      }, 2500)
    } else {
      this.showAlertError = true
      setTimeout(() => {
        document.getElementById('fadeError').className = 'fadeOut'
        this.showAlertError = false
      }, 2500)
    }
  }
}
