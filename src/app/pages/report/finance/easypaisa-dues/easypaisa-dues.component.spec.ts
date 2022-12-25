import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasypaisaDuesComponent } from './easypaisa-dues.component';

describe('EasypaisaDuesComponent', () => {
  let component: EasypaisaDuesComponent;
  let fixture: ComponentFixture<EasypaisaDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasypaisaDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasypaisaDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
