import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Manage.QuizComponent } from './manage.quiz.component';

describe('Manage.QuizComponent', () => {
  let component: Manage.QuizComponent;
  let fixture: ComponentFixture<Manage.QuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Manage.QuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manage.QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
