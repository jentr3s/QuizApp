import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
@Injectable()
export class SharedService {

  // This is to show main page
  private isMainPage = new BehaviorSubject<boolean>(true);
  mainPage = this.isMainPage.asObservable();

  // User who logged in value
  private userLoggedIn = new BehaviorSubject<any>([]);
  loginUser = this.userLoggedIn.asObservable();


  // This is to show main page
  private testPage = new BehaviorSubject<boolean>(false);
  test = this.testPage.asObservable();

  constructor() { }

  changeMainPage(data) {
    this.isMainPage.next(data);
  }

  changeLoginValue(data) {
    this.userLoggedIn.next(data);
  }

  changeTest(data) {
    this.testPage.next(data);
  }

}
