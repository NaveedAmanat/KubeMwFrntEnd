import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McbDisburseFundsStatusComponent } from './mcb-disburse-funds-status.component';

describe('McbDisburseFundsStatusComponent', () => {
  let component: McbDisburseFundsStatusComponent;
  let fixture: ComponentFixture<McbDisburseFundsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McbDisburseFundsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McbDisburseFundsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
