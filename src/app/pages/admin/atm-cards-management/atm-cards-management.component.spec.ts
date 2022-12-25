import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmCardsManagementComponent } from './atm-cards-management.component';

describe('AtmCardsManagementComponent', () => {
  let component: AtmCardsManagementComponent;
  let fixture: ComponentFixture<AtmCardsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtmCardsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtmCardsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
