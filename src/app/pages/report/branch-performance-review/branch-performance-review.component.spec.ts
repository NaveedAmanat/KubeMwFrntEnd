import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchPerformanceReviewComponent } from './branch-performance-review.component';

describe('BranchPerformanceReviewComponent', () => {
  let component: BranchPerformanceReviewComponent;
  let fixture: ComponentFixture<BranchPerformanceReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchPerformanceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchPerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
