import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchExpenseFundsRequestComponent } from './branch-expense-funds-request.component';

describe('BranchExpenseFundsRequestComponent', () => {
  let component: BranchExpenseFundsRequestComponent;
  let fixture: ComponentFixture<BranchExpenseFundsRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchExpenseFundsRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchExpenseFundsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
