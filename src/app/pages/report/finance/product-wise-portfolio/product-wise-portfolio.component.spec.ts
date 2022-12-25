import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWisePortfolioComponent } from './product-wise-portfolio.component';

describe('ProductWisePortfolioComponent', () => {
  let component: ProductWisePortfolioComponent;
  let fixture: ComponentFixture<ProductWisePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWisePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWisePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
