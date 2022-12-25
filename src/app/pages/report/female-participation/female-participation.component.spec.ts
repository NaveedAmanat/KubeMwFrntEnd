import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FemaleParticipationComponent } from './female-participation.component';

describe('FemaleParticipationComponent', () => {
  let component: FemaleParticipationComponent;
  let fixture: ComponentFixture<FemaleParticipationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FemaleParticipationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FemaleParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
