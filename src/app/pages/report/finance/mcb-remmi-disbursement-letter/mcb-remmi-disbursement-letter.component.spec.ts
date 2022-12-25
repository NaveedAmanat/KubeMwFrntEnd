import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McbRemmiDisbursementLetterComponent } from './mcb-remmi-disbursement-letter.component';

describe('McbRemmiDisbursementLetterComponent', () => {
  let component: McbRemmiDisbursementLetterComponent;
  let fixture: ComponentFixture<McbRemmiDisbursementLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McbRemmiDisbursementLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McbRemmiDisbursementLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
