import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Manage.UserComponent } from './manage.user.component';

describe('Manage.UserComponent', () => {
  let component: Manage.UserComponent;
  let fixture: ComponentFixture<Manage.UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Manage.UserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manage.UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
