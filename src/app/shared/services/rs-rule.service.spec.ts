import { TestBed, inject } from '@angular/core/testing';

import { RsRuleService } from './rs-rule.service';

describe('RsRuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RsRuleService]
    });
  });

  it('should be created', inject([RsRuleService], (service: RsRuleService) => {
    expect(service).toBeTruthy();
  }));
});
