import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateWiseDisbComponent } from './date-wise-disb.component';

describe('DateWiseDisbComponent', () => {
  let component: DateWiseDisbComponent;
  let fixture: ComponentFixture<DateWiseDisbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateWiseDisbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateWiseDisbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
