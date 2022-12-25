import { TestBed, inject } from '@angular/core/testing';

import { AnmlService } from './anml.service';

describe('AnmlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnmlService]
    });
  });

  it('should be created', inject([AnmlService], (service: AnmlService) => {
    expect(service).toBeTruthy();
  }));
});
