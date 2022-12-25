import { TestBed, inject } from '@angular/core/testing';

import { AtmCardsManagementService } from './atm-cards-management.service';

describe('AtmCardsManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtmCardsManagementService]
    });
  });

  it('should be created', inject([AtmCardsManagementService], (service: AtmCardsManagementService) => {
    expect(service).toBeTruthy();
  }));
});
