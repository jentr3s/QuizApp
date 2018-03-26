import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public showHeader: boolean = false;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.header.subscribe(res => this.showHeader = res);
    this.sharedService.changeHeader(this.showHeader);
  }

  back(){
    this.sharedService.changeHeader(this.showHeader = true);
    
    this.router.navigate(['']);
    
  }

}
