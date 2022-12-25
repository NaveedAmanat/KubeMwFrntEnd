import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenparticipationComponent } from './womenparticipation.component';

describe('WomenparticipationComponent', () => {
  let component: WomenparticipationComponent;
  let fixture: ComponentFixture<WomenparticipationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WomenparticipationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WomenparticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
