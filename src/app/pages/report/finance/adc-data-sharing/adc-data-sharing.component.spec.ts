import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdcDataSharingComponent } from './adc-data-sharing.component';

describe('AdcDataSharingComponent', () => {
  let component: AdcDataSharingComponent;
  let fixture: ComponentFixture<AdcDataSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdcDataSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdcDataSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
