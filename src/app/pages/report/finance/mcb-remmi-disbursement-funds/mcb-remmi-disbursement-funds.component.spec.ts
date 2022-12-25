import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McbRemmiDisbursementFundsComponent } from './mcb-remmi-disbursement-funds.component';

describe('McbRemmiDisbursementFundsComponent', () => {
  let component: McbRemmiDisbursementFundsComponent;
  let fixture: ComponentFixture<McbRemmiDisbursementFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McbRemmiDisbursementFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McbRemmiDisbursementFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
