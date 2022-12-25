import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisAuditComponent } from './analysis-audit.component';

describe('AnalysisAuditComponent', () => {
  let component: AnalysisAuditComponent;
  let fixture: ComponentFixture<AnalysisAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
