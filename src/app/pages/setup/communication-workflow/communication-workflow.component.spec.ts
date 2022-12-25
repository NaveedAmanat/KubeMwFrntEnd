import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationWorkflowComponent } from './communication-workflow.component';

describe('CommunicationWorkflowComponent', () => {
  let component: CommunicationWorkflowComponent;
  let fixture: ComponentFixture<CommunicationWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
