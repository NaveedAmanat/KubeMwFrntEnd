import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileWalletTrendComponent } from './mobile-wallet-trend.component';

describe('MobileWalletTrendComponent', () => {
  let component: MobileWalletTrendComponent;
  let fixture: ComponentFixture<MobileWalletTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileWalletTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileWalletTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
