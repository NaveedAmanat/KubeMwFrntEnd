import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectedClientsLoanCompletionComponent } from './projected-clients-loan-completion.component';

describe('ProjectedClientsLoanCompletionComponent', () => {
  let component: ProjectedClientsLoanCompletionComponent;
  let fixture: ComponentFixture<ProjectedClientsLoanCompletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectedClientsLoanCompletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectedClientsLoanCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
