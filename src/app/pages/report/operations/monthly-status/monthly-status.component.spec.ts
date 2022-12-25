import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyStatusComponent } from './monthly-status.component';

describe('MonthlyStatusComponent', () => {
  let component: MonthlyStatusComponent;
  let fixture: ComponentFixture<MonthlyStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
