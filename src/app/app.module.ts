import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { SharedService } from './shared.service';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { QuizComponent } from './quiz/quiz.component';
import { ManageQuizComponent } from './settings/manage.quiz/manage.quiz.component';
import { ManageResultComponent } from './settings/manage.result/manage.result.component';

import { PagerService } from './_shared/index';
import { ManageOptionsComponent } from './settings/manage.options/manage.options.component';
import { ManageUserComponent } from './settings/manage.user/manage.user.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    QuizComponent,
    ManageQuizComponent,
    ManageResultComponent,
    ManageOptionsComponent,
    ManageUserComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,

    NgbModule.forRoot()
  ],
  providers: [SharedService, PagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
