import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderWisePortfolioComponent } from './gender-wise-portfolio.component';

describe('GenderWisePortfolioComponent', () => {
  let component: GenderWisePortfolioComponent;
  let fixture: ComponentFixture<GenderWisePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenderWisePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderWisePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
