import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowActionComponent } from './add-workflow-action.component';

describe('AddWorkflowActionComponent', () => {
  let component: AddWorkflowActionComponent;
  let fixture: ComponentFixture<AddWorkflowActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkflowActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkflowActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
