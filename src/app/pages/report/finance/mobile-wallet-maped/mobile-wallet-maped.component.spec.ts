import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileWalletMapedComponent } from './mobile-wallet-maped.component';

describe('MobileWalletMapedComponent', () => {
  let component: MobileWalletMapedComponent;
  let fixture: ComponentFixture<MobileWalletMapedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileWalletMapedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileWalletMapedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
