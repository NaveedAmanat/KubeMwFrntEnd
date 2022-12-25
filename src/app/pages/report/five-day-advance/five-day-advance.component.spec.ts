import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveDayAdvanceComponent } from './five-day-advance.component';

describe('FiveDayAdvanceComponent', () => {
  let component: FiveDayAdvanceComponent;
  let fixture: ComponentFixture<FiveDayAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiveDayAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveDayAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
