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

  score: number = 0;

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

    // Checks if user has inputted an answer
    if (this.answerInput != null) {

      let exist = this.answers.filter(answer => answer.itemId == this.itemId.nativeElement.value);

      console.log("exist " + exist);
      this.answers.push({ itemId: this.itemId.nativeElement.value, answer: this.answerInput });

      this.answerInput = null;
    }
    // Else its multiple choice
    else {
      this.answers.push(this.answer);
    }

    if (this.questionindex == this.items.length)
      this.compute();
  }

  onSelectionChange(data, itemId) {
    this.answer = { itemId: itemId, answer: data };
  }

  compute() {
    console.log("Compute!");
    console.log(this.answers);
    this.score = 0;

    for (let i = 0; i < this.answers; i++) {
      // if (this.answer[i] == this.items[i].Answer) {
      //   this.score += 1;
      // }

      let item = this.items.filter(item => item.Id == this.answer[i].itemId);
      if (item) {
        console.log("this item" + item)
      }
    }
    console.log("Score : " + this.score)
    return this.score;
  }

  back() {
    this.router.navigate(['']);
    this.answers = null;
  }

}
