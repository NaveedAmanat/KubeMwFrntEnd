import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysExemptionComponent } from './holidays-exemption.component';

describe('HolidaysExemptionComponent', () => {
  let component: HolidaysExemptionComponent;
  let fixture: ComponentFixture<HolidaysExemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaysExemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaysExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
