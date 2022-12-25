import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BMmobileWalletTrendComponent } from './bmmobile-wallet-trend.component';

describe('BMmobileWalletTrendComponent', () => {
  let component: BMmobileWalletTrendComponent;
  let fixture: ComponentFixture<BMmobileWalletTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BMmobileWalletTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BMmobileWalletTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
