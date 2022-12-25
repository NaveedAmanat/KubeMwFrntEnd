import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDisbursementFundsComponent } from './check-disbursement-funds.component';

describe('CheckDisbursementFundsComponent', () => {
  let component: CheckDisbursementFundsComponent;
  let fixture: ComponentFixture<CheckDisbursementFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckDisbursementFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDisbursementFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
