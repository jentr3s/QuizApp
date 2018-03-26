import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedService {

  private showHeader = new BehaviorSubject<boolean>(true);
  header = this.showHeader.asObservable();

  constructor() { }

  changeHeader(header){
    this.showHeader.next(header);
  }
}
