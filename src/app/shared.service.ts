import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedService {

  private isMainPage = new BehaviorSubject<boolean>(true);
  mainPage = this.isMainPage.asObservable();

  constructor() { }

  changeMainPage(header){
    this.isMainPage.next(header);
  }
}
