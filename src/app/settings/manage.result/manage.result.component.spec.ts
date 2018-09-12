import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Manage.ResultComponent } from './manage.result.component';

describe('Manage.ResultComponent', () => {
  let component: Manage.ResultComponent;
  let fixture: ComponentFixture<Manage.ResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Manage.ResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manage.ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
