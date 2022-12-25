import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerisysReportComponent } from './verisys-report.component';

describe('VerisysReportComponent', () => {
  let component: VerisysReportComponent;
  let fixture: ComponentFixture<VerisysReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerisysReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerisysReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
