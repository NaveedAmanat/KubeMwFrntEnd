import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchWiseDisbAndReversalComponent } from './branch-wise-disb-and-reversal.component';

describe('BranchWiseDisbAndReversalComponent', () => {
  let component: BranchWiseDisbAndReversalComponent;
  let fixture: ComponentFixture<BranchWiseDisbAndReversalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchWiseDisbAndReversalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchWiseDisbAndReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
