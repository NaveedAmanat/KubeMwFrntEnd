import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioAtRiskTimeComponent } from './portfolio-at-risk-time.component';

describe('PortfolioAtRiskTimeComponent', () => {
  let component: PortfolioAtRiskTimeComponent;
  let fixture: ComponentFixture<PortfolioAtRiskTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioAtRiskTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioAtRiskTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
