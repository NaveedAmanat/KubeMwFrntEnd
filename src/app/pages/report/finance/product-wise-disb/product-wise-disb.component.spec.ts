import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseDisbComponent } from './product-wise-disb.component';

describe('ProductWiseDisbComponent', () => {
  let component: ProductWiseDisbComponent;
  let fixture: ComponentFixture<ProductWiseDisbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWiseDisbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWiseDisbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
