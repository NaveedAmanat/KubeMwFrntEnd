import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrnchTurnoverAnlysisComponent } from './brnch-turnover-anlysis.component';

describe('BrnchTurnoverAnlysisComponent', () => {
  let component: BrnchTurnoverAnlysisComponent;
  let fixture: ComponentFixture<BrnchTurnoverAnlysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrnchTurnoverAnlysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrnchTurnoverAnlysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
