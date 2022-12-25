import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHospitalComponent } from './panel-hospital.component';

describe('PanelHospitalComponent', () => {
  let component: PanelHospitalComponent;
  let fixture: ComponentFixture<PanelHospitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelHospitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
