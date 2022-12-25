import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AblLoanRecoveryDuesComponent } from './abl-loan-recovery-dues.component';

describe('AblLoanRecoveryDuesComponent', () => {
  let component: AblLoanRecoveryDuesComponent;
  let fixture: ComponentFixture<AblLoanRecoveryDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AblLoanRecoveryDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AblLoanRecoveryDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
