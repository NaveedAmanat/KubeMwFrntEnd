import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchWisePortfolioComponent } from './branch-wise-portfolio.component';

describe('BranchWisePortfolioComponent', () => {
  let component: BranchWisePortfolioComponent;
  let fixture: ComponentFixture<BranchWisePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchWisePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchWisePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
