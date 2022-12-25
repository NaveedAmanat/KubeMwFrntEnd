import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McbDisbursementComponent } from './mcb-disbursement.component';

describe('McbDisbursementComponent', () => {
  let component: McbDisbursementComponent;
  let fixture: ComponentFixture<McbDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McbDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McbDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
