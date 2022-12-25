import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchWiseRecoveryComponent } from './branch-wise-recovery.component';

describe('BranchWiseRecoveryComponent', () => {
  let component: BranchWiseRecoveryComponent;
  let fixture: ComponentFixture<BranchWiseRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchWiseRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchWiseRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
