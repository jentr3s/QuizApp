import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class SharedService {

  // This is to show main page
  private isMainPage = new BehaviorSubject<boolean>(true);
  mainPage = this.isMainPage.asObservable();

  // User who logged in value
  private userLoggedIn = new BehaviorSubject<object>({ Id: 0, Name: 'empty', Username: 'empty', PermissionType: 'empty' });
  loginUser = this.userLoggedIn.asObservable();

   // This is to know if user is logged in
   private isLoggedIn = new BehaviorSubject<boolean>(false);
   loggedIn = this.isLoggedIn.asObservable();

  constructor() { }

  changeMainPage(data) {
    this.isMainPage.next(data);
  }

  changeLoggedInUserDetail(data) {
    this.userLoggedIn.next(data);
  }

  changeIsLoggedIn(data) {
    this.isLoggedIn.next(data);
  }
}
