import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { SharedService } from '../shared.service'

declare let electron: any

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  @ViewChild('var') itemId: ElementRef
  // IPC Renderer
  ipc = electron.ipcRenderer

  quiz: any
  items: any

  questionIndex: number = 0

  answers: any = []
  answer: any

  // For fill in the blanks
  answerInput: string

  score: number = 0
  studentName: string
  hasName: boolean = false
  errorMsg: string = null
  isValid: string = null
  noAnswer: string = null
  errorMsgNoAnswer: string = null
  passed: boolean = false
  failed: boolean = false

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.loadQuiz()
  }

  loadQuiz() {
    const result = this.ipc.sendSync('getActiveQuiz')
    const parseQuiz = JSON.parse(result)
    if (parseQuiz) {
      this.quiz = parseQuiz[0]
      this.loadItems(this.quiz.Id)
    }
  }

  loadItems(quizId: any) {
    const result = this.ipc.sendSync('getItems', quizId)
    this.items = JSON.parse(result)
    for (let i = 0; i < this.items.length; i++) {
      const opt = this.items[i].Options
      if (opt !== null) {
        this.items[i].Options = opt.toString().split(',')
      } else {
        this.items[i].Options = null
      }
    }

    this.shuffleItems(this.items)
  }

  shuffleItems(items: any) {
    let m = items.length, t, i;

    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = items[m];
      items[m] = items[i];
      items[i] = t;
    }

    return items;
  }

  next() {
    this.noAnswer = null
    this.errorMsg = null
    if (this.validate()) {
      this.questionIndex++
      this.hasName = true

      // Reset error message
      this.noAnswer = null
      this.errorMsgNoAnswer = null

      // Checks if user has inputted an answer
      if (this.answerInput != null) {
        // For getting the hidden id value
        const id = parseInt(this.itemId.nativeElement.value, 10)
        this.answers.push({ itemId: id, answer: this.answerInput })

        this.answerInput = null
      } else {
        // Else its multiple choice
        this.answers.push(this.answer)
      }

      if (this.questionIndex === this.items.length) {
        this.compute()
      }
    }

    // reset answer
    this.answer = null
    this.answerInput = null
  }

  validate() {

    if (this.studentName == null) {
      this.hasName = false
      this.isValid = 'is-invalid'
      this.errorMsg = 'Please enter your name.'
      return false
    }

    if ((this.answerInput === null || this.answerInput === undefined || this.answerInput === '') &&
      (this.answer === null || this.answer === undefined)) {
      this.noAnswer = 'is-invalid'
      this.errorMsgNoAnswer = 'Please select you answer'
      return false
    }
    return true
  }

  // This is for the radio button on click changes
  onSelectionChange(data, itemId) {
    this.answer = { itemId: itemId, answer: data }
  }

  compute() {
    this.score = 0

    for (let i = 0; i < this.answers.length; i++) {

      const item = this.items.filter(x => x.Id === this.answers[i].itemId
        && x.Answer.toLowerCase() === this.answers[i].answer.toLowerCase())[0]

      if (item) {
        this.score += 1
      }
    }

    const result = this.items.length / 2
    if (this.score >= result) {
      this.passed = true
    } else {
      this.failed = true
    }

    this.saveResult()
    return this.score
  }

  saveResult() {
    let res: string = null
    let id: string = null
    if (this.passed) {
      res = 'Passed'
    } else { res = 'Failed' }

    const insertQuizResult = {
      QuizId: this.quiz.Id,
      StudentName: this.studentName,
      Result: res, Answers: JSON.stringify(this.answers),
      Score: this.score,
      Items: this.items.length
    }

    const result = this.ipc.sendSync('postQuizResult', insertQuizResult)
    id = JSON.parse(result)
  }

  back() {
    this.router.navigate([''])
    this.answers = null
  }
}
