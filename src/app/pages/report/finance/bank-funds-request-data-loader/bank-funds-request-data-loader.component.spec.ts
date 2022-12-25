import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankFundsRequestDataLoaderComponent } from './bank-funds-request-data-loader.component';

describe('BankFundsRequestDataLoaderComponent', () => {
  let component: BankFundsRequestDataLoaderComponent;
  let fixture: ComponentFixture<BankFundsRequestDataLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankFundsRequestDataLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankFundsRequestDataLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
