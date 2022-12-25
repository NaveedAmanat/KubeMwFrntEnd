import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryTrendAnalysisComponent } from './recovery-trend-analysis.component';

describe('RecoveryTrendAnalysisComponent', () => {
  let component: RecoveryTrendAnalysisComponent;
  let fixture: ComponentFixture<RecoveryTrendAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryTrendAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryTrendAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
