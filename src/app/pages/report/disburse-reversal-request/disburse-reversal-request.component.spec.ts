import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisburseReversalRequestComponent } from './disburse-reversal-request.component';

describe('DisburseReversalRequestComponent', () => {
  let component: DisburseReversalRequestComponent;
  let fixture: ComponentFixture<DisburseReversalRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisburseReversalRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisburseReversalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
