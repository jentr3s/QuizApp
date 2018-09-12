import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Manage.OptionsComponent } from './manage.options.component';

describe('Manage.OptionsComponent', () => {
  let component: Manage.OptionsComponent;
  let fixture: ComponentFixture<Manage.OptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Manage.OptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manage.OptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
