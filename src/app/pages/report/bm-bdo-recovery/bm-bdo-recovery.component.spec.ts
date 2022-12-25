import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmBdoRecoveryComponent } from './bm-bdo-recovery.component';

describe('BmBdoRecoveryComponent', () => {
  let component: BmBdoRecoveryComponent;
  let fixture: ComponentFixture<BmBdoRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmBdoRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmBdoRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
