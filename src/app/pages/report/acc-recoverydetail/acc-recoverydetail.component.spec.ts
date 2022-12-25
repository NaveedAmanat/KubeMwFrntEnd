import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccRecoverydetailComponent } from './acc-recoverydetail.component';

describe('AccRecoverydetailComponent', () => {
  let component: AccRecoverydetailComponent;
  let fixture: ComponentFixture<AccRecoverydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccRecoverydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccRecoverydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
