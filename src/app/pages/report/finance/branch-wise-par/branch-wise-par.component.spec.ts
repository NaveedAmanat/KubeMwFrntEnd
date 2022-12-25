import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchWiseParComponent } from './branch-wise-par.component';

describe('BranchWiseParComponent', () => {
  let component: BranchWiseParComponent;
  let fixture: ComponentFixture<BranchWiseParComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchWiseParComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchWiseParComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
