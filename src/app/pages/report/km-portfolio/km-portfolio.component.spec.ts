import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KmPortfolioComponent } from './km-portfolio.component';

describe('KmPortfolioComponent', () => {
  let component: KmPortfolioComponent;
  let fixture: ComponentFixture<KmPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KmPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KmPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
