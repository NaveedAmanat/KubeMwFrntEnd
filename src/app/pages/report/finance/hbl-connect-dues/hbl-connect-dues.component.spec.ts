import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblConnectDuesComponent } from './hbl-connect-dues.component';

describe('HblConnectDuesComponent', () => {
  let component: HblConnectDuesComponent;
  let fixture: ComponentFixture<HblConnectDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblConnectDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblConnectDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
