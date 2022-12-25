import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiriesTelenorCollectionReportComponent } from './inquiries-telenor-collection-report.component';

describe('InquiriesTelenorCollectionReportComponent', () => {
  let component: InquiriesTelenorCollectionReportComponent;
  let fixture: ComponentFixture<InquiriesTelenorCollectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InquiriesTelenorCollectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiriesTelenorCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
