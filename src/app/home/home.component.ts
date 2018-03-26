import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public showMainPage: boolean = false;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.mainPage.subscribe(res => this.showMainPage = res);
    this.sharedService.changeMainPage(this.showMainPage);
  }

  back(){
    this.sharedService.changeMainPage(this.showMainPage = true);
    
    this.router.navigate(['']);
    
  }

}
