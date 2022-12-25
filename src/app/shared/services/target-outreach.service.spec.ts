import { TestBed, inject } from '@angular/core/testing';

import { TargetOutreachService } from './target-outreach.service';

describe('TargetOutreachService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TargetOutreachService]
    });
  });

  it('should be created', inject([TargetOutreachService], (service: TargetOutreachService) => {
    expect(service).toBeTruthy();
  }));
});
