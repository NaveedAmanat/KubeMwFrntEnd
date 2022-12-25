import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsReportingComponent } from './accounts-reporting.component';

describe('AccountsReportingComponent', () => {
  let component: AccountsReportingComponent;
  let fixture: ComponentFixture<AccountsReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
