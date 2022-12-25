import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorWisePortfolioComponent } from './sector-wise-portfolio.component';

describe('SectorWisePortfolioComponent', () => {
  let component: SectorWisePortfolioComponent;
  let fixture: ComponentFixture<SectorWisePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorWisePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorWisePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
