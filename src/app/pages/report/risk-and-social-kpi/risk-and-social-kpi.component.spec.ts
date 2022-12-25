import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAndSocialKpiComponent } from './risk-and-social-kpi.component';

describe('RiskAndSocialKpiComponent', () => {
  let component: RiskAndSocialKpiComponent;
  let fixture: ComponentFixture<RiskAndSocialKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAndSocialKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAndSocialKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
