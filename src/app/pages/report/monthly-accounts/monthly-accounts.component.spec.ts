import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyAccountsComponent } from './monthly-accounts.component';

describe('MonthlyAccountsComponent', () => {
  let component: MonthlyAccountsComponent;
  let fixture: ComponentFixture<MonthlyAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
