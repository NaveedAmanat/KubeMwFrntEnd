import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FemaleParticipationRatioComponent } from './female-participation-ratio.component';

describe('FemaleParticipationRatioComponent', () => {
  let component: FemaleParticipationRatioComponent;
  let fixture: ComponentFixture<FemaleParticipationRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FemaleParticipationRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FemaleParticipationRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
