import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedBankFundsComponent } from './consolidated-bank-funds.component';

describe('ConsolidatedBankFundsComponent', () => {
  let component: ConsolidatedBankFundsComponent;
  let fixture: ComponentFixture<ConsolidatedBankFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedBankFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedBankFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
