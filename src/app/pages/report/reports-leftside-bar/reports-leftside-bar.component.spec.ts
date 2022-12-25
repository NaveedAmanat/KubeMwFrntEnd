import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsLeftsideBarComponent } from './reports-leftside-bar.component';

describe('ReportsLeftsideBarComponent', () => {
  let component: ReportsLeftsideBarComponent;
  let fixture: ComponentFixture<ReportsLeftsideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsLeftsideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsLeftsideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
