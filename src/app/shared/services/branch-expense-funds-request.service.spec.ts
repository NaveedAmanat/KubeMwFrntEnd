import { TestBed, inject } from '@angular/core/testing';

import { BranchExpenseFundsRequestService } from './branch-expense-funds-request.service';

describe('BranchExpenseFundsRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchExpenseFundsRequestService]
    });
  });

  it('should be created', inject([BranchExpenseFundsRequestService], (service: BranchExpenseFundsRequestService) => {
    expect(service).toBeTruthy();
  }));
});
