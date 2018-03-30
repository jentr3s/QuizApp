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
  questionindex: number = 0;
  answers: any = [];
  answer: any;
  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.loadQuiz();
  }

  loadQuiz() {
    let result = this.ipc.sendSync("loadQuiz");
    this.quiz = JSON.parse(result);
    this.loadItems(this.quiz.Id);
  }

  loadItems(quizId: any) {
    let result = this.ipc.sendSync("loadItems", quizId)
    this.items = JSON.parse(result);
    for (let i = 0; i < this.items.length; i++) {

      this.items[i].Options = JSON.parse(this.items[i].Options);
    }
    console.log(this.items);
  }

  next() {
    this.questionindex++;
    this.answers.push(this.answer);
    console.log(this.answers);
  }

  onSelectionChange(data, quizId) {
    this.answer = { QuizId: quizId, answer: data };
  }
  back() {
    this.router.navigate(['']);
  }

}
