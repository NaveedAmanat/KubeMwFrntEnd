import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelWiseDisbComponent } from './channel-wise-disb.component';

describe('ChannelWiseDisbComponent', () => {
  let component: ChannelWiseDisbComponent;
  let fixture: ComponentFixture<ChannelWiseDisbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelWiseDisbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelWiseDisbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
