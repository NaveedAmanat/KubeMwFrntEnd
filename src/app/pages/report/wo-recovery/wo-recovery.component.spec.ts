import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoRecoveryComponent } from './wo-recovery.component';

describe('WoRecoveryComponent', () => {
  let component: WoRecoveryComponent;
  let fixture: ComponentFixture<WoRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
