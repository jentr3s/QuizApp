import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SharedService } from './shared.service';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    NgbModule.forRoot()
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
