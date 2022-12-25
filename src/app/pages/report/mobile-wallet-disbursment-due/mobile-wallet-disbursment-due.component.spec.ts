import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileWalletDisbursmentDueComponent } from './mobile-wallet-disbursment-due.component';

describe('MobileWalletDisbursmentDueComponent', () => {
  let component: MobileWalletDisbursmentDueComponent;
  let fixture: ComponentFixture<MobileWalletDisbursmentDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileWalletDisbursmentDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileWalletDisbursmentDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
