import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceMonitoringComponent } from './attendance-monitoring.component';

describe('AttendanceMonitoringComponent', () => {
  let component: AttendanceMonitoringComponent;
  let fixture: ComponentFixture<AttendanceMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
