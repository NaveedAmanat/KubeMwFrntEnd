import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseParComponent } from './product-wise-par.component';

describe('ProductWiseParComponent', () => {
  let component: ProductWiseParComponent;
  let fixture: ComponentFixture<ProductWiseParComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWiseParComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWiseParComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
