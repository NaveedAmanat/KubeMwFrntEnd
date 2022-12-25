import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalRiskFlaggingReportComponent } from './regional-risk-flagging-report.component';

describe('RegionalRiskFlaggingReportComponent', () => {
  let component: RegionalRiskFlaggingReportComponent;
  let fixture: ComponentFixture<RegionalRiskFlaggingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionalRiskFlaggingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalRiskFlaggingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
