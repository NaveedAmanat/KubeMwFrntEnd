import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueloansReportComponent } from './overdueloans-report.component';

describe('OverdueloansReportComponent', () => {
  let component: OverdueloansReportComponent;
  let fixture: ComponentFixture<OverdueloansReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueloansReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueloansReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
