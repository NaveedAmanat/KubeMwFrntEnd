import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBrnchMapedListComponent } from './bank-brnch-maped-list.component';

describe('BankBrnchMapedListComponent', () => {
  let component: BankBrnchMapedListComponent;
  let fixture: ComponentFixture<BankBrnchMapedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankBrnchMapedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankBrnchMapedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
