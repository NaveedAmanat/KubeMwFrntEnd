import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PARBranchWiseComponent } from './par-branch-wise.component';

describe('PARBranchWiseComponent', () => {
  let component: PARBranchWiseComponent;
  let fixture: ComponentFixture<PARBranchWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PARBranchWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PARBranchWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
