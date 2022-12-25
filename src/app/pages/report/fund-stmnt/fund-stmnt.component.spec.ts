import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundStmntComponent } from './fund-stmnt.component';

describe('FundStmntComponent', () => {
  let component: FundStmntComponent;
  let fixture: ComponentFixture<FundStmntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundStmntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStmntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
