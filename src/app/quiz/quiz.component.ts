import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

declare let electron: any;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  // IPC Renderer
  ipc = electron.ipcRenderer;
  quiz: any;
  items: any;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.loadQuiz();
  }

  loadQuiz() {
    let result = this.ipc.sendSync("loadQuiz");
    this.quiz = JSON.parse(result);
    console.log(this.quiz);
  }

  loadItems(quizId: number) {
    let result = this.ipc.sendSync("loadItems", quizId)
    this.items = JSON.parse(result);
  }

  back() {
    this.router.navigate(['']);

  }

}
