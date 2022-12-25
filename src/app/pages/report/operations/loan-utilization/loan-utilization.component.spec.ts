import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanUtilizationComponent } from './loan-utilization.component';

describe('LoanUtilizationComponent', () => {
  let component: LoanUtilizationComponent;
  let fixture: ComponentFixture<LoanUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
