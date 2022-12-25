import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchWiseDisbComponent } from './branch-wise-disb.component';

describe('BranchWiseDisbComponent', () => {
  let component: BranchWiseDisbComponent;
  let fixture: ComponentFixture<BranchWiseDisbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchWiseDisbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchWiseDisbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
