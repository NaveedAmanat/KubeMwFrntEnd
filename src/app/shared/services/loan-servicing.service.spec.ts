import { TestBed, inject } from '@angular/core/testing';

import { LoanServicingService } from './loan-servicing.service';

describe('LoanServicingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanServicingService]
    });
  });

  it('should be created', inject([LoanServicingService], (service: LoanServicingService) => {
    expect(service).toBeTruthy();
  }));
});
