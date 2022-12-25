import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenciesTargetTrackingComponent } from './agencies-target-tracking.component';

describe('AgenciesTargetTrackingComponent', () => {
  let component: AgenciesTargetTrackingComponent;
  let fixture: ComponentFixture<AgenciesTargetTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgenciesTargetTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgenciesTargetTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
