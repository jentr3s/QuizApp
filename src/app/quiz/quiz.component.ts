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
  studentName: string;
  hasName: boolean = false;

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

    if (this.studentName != null)
      this.hasName = true;
      
    // Checks if user has inputted an answer
    if (this.answerInput != null) {
      let id = parseInt(this.itemId.nativeElement.value);
      this.answers.push({ itemId: id, answer: this.answerInput });

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
    console.log(this.answers);
    this.score = 0;

    for (let i = 0; i < this.answers.length; i++) {

      let item = this.items.filter(item => item.Id == this.answers[i].itemId && item.Answer.toLowerCase() == this.answers[i].answer.toLowerCase())[0];

      if (item) {
        this.score += 1;
      }

    }
    return this.score;
  }

  back() {
    this.router.navigate(['']);
    this.answers = null;
  }

}
