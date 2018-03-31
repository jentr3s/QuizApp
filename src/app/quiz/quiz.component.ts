import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

declare let electron: any;
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  @ViewChild('var') itemId: ElementRef;
  // IPC Renderer
  ipc = electron.ipcRenderer;

  quiz: any;
  items: any;

  questionindex: number = 0;

  answers: any = [];
  answer: any;

  // For fill in the blanks
  answerInput: string;

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

    if (this.answerInput != null) {
      this.answers.push({ QuizId: this.itemId, answer: this.answerInput });
      console.log("ItemId " + this.itemId.nativeElement.value);

    }
    else
      this.answers.push(this.answer);

    // For fill in the blanks
    this.answerInput = null;
    // this.quizIdInput = null;
  }

  onSelectionChange(data, itemId) {
    this.answer = { ItemId: itemId, answer: data };
  }
  back() {
    this.router.navigate(['']);
  }

}
