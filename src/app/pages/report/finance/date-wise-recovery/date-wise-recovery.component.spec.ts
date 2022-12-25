import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateWiseRecoveryComponent } from './date-wise-recovery.component';

describe('DateWiseRecoveryComponent', () => {
  let component: DateWiseRecoveryComponent;
  let fixture: ComponentFixture<DateWiseRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateWiseRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateWiseRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
