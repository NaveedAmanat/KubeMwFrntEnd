import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelWiseRecoveryComponent } from './channel-wise-recovery.component';

describe('ChannelWiseRecoveryComponent', () => {
  let component: ChannelWiseRecoveryComponent;
  let fixture: ComponentFixture<ChannelWiseRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelWiseRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelWiseRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
