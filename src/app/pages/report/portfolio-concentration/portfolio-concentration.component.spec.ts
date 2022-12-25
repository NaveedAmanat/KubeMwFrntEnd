import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioConcentrationComponent } from './portfolio-concentration.component';

describe('PortfolioConcentrationComponent', () => {
  let component: PortfolioConcentrationComponent;
  let fixture: ComponentFixture<PortfolioConcentrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioConcentrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioConcentrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
