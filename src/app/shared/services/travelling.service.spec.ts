import { TestBed, inject } from '@angular/core/testing';

import { TravellingService } from './travelling.service';

describe('TravellingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TravellingService]
    });
  });

  it('should be created', inject([TravellingService], (service: TravellingService) => {
    expect(service).toBeTruthy();
  }));
});
