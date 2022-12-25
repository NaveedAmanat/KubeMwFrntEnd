import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionDisbursementComponent } from './region-disbursement.component';

describe('RegionDisbursementComponent', () => {
  let component: RegionDisbursementComponent;
  let fixture: ComponentFixture<RegionDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
