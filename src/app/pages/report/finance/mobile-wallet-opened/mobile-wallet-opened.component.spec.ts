import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileWalletDisbursmentComponent } from './mobile-wallet-disbursment.component';

describe('MobileWalletDisbursmentComponent', () => {
  let component: MobileWalletDisbursmentComponent;
  let fixture: ComponentFixture<MobileWalletDisbursmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileWalletDisbursmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileWalletDisbursmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
