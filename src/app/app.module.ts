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


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    QuizComponent,
    ManageQuizComponent,
    ManageResultComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,

    NgbModule.forRoot()
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
