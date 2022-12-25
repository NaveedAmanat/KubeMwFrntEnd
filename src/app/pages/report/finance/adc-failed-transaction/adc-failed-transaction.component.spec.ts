import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdcFailedTransactionComponent } from './adc-failed-transaction.component';

describe('AdcFailedTransactionComponent', () => {
  let component: AdcFailedTransactionComponent;
  let fixture: ComponentFixture<AdcFailedTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdcFailedTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdcFailedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
