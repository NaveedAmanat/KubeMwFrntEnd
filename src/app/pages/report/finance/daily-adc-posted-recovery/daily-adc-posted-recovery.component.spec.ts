import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAdcPostedRecoveryComponent } from './daily-adc-posted-recovery.component';

describe('DailyAdcPostedRecoveryComponent', () => {
  let component: DailyAdcPostedRecoveryComponent;
  let fixture: ComponentFixture<DailyAdcPostedRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAdcPostedRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAdcPostedRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
