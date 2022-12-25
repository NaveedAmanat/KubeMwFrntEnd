import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalRecoveryTrendComponent } from './regional-recovery-trend.component';

describe('RegionalRecoveryTrendComponent', () => {
  let component: RegionalRecoveryTrendComponent;
  let fixture: ComponentFixture<RegionalRecoveryTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionalRecoveryTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalRecoveryTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
