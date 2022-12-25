import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumDataKmComponent } from './premium-data-km.component';

describe('PremiumDataKmComponent', () => {
  let component: PremiumDataKmComponent;
  let fixture: ComponentFixture<PremiumDataKmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumDataKmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumDataKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
