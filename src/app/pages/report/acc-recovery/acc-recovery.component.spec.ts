import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccRecoveryComponent } from './acc-recovery.component';

describe('AccRecoveryComponent', () => {
  let component: AccRecoveryComponent;
  let fixture: ComponentFixture<AccRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
