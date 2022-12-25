import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsLoanMaturityComponent } from './clients-loan-maturity.component';

describe('ClientsLoanMaturityComponent', () => {
  let component: ClientsLoanMaturityComponent;
  let fixture: ComponentFixture<ClientsLoanMaturityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsLoanMaturityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsLoanMaturityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
