import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBankBookCsvComponent } from './export-bank-book-csv.component';

describe('ExportBankBookCsvComponent', () => {
  let component: ExportBankBookCsvComponent;
  let fixture: ComponentFixture<ExportBankBookCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportBankBookCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportBankBookCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
