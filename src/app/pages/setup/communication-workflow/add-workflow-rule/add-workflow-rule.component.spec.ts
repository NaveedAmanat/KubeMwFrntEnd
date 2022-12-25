import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowRuleComponent } from './add-workflow-rule.component';

describe('AddWorkflowRuleComponent', () => {
  let component: AddWorkflowRuleComponent;
  let fixture: ComponentFixture<AddWorkflowRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkflowRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkflowRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
