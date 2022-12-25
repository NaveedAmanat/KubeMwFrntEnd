import { TestBed, inject } from '@angular/core/testing';

import { VehicleLoansService } from './vehicle-loans.service';

describe('VehicleLoansService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleLoansService]
    });
  });

  it('should be created', inject([VehicleLoansService], (service: VehicleLoansService) => {
    expect(service).toBeTruthy();
  }));
});
