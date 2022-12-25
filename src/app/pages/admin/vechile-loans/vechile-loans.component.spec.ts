import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VechileLoansComponent } from './vechile-loans.component';

describe('VechileLoansComponent', () => {
  let component: VechileLoansComponent;
  let fixture: ComponentFixture<VechileLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VechileLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VechileLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
