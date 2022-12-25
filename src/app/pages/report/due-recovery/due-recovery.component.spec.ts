import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DueRecoveryComponent } from './due-recovery.component';

describe('DueRecoveryComponent', () => {
  let component: DueRecoveryComponent;
  let fixture: ComponentFixture<DueRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DueRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DueRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
