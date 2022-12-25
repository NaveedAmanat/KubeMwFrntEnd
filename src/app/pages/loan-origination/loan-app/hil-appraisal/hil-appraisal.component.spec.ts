import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HilAppraisalComponent } from './hil-appraisal.component';

describe('HilAppraisalComponent', () => {
  let component: HilAppraisalComponent;
  let fixture: ComponentFixture<HilAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HilAppraisalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HilAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
