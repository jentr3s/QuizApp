import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedService {

  // This is to show main page
  private isMainPage = new BehaviorSubject<boolean>(true);
  mainPage = this.isMainPage.asObservable();

  // This is to show settings page
  private isSettingsPage = new BehaviorSubject<boolean>(false);
  settings = this.isSettingsPage.asObservable()

  constructor() { }

  changeMainPage(data){
    this.isMainPage.next(data);
  }

  ChangeSettingsPage(data){
    this.isSettingsPage.next(data);
  }

}
