import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { QuizComponent } from './quiz/quiz.component';
import { ManageQuizComponent } from './settings/manage.quiz/manage.quiz.component';
import { ManageResultComponent } from './settings/manage.result/manage.result.component';
import { ManageOptionsComponent } from './settings/manage.options/manage.options.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'quiz',
    component: QuizComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'manageQuiz',
    component: ManageQuizComponent
  },
  {
    path: 'manageResult',
    component: ManageResultComponent
  },
  {
    path: 'manageOptions',
    component: ManageOptionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
