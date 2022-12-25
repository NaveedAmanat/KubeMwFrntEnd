import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UblOmniMapedComponent } from './ubl-omni-maped.component';

describe('UblOmniMapedComponent', () => {
  let component: UblOmniMapedComponent;
  let fixture: ComponentFixture<UblOmniMapedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UblOmniMapedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UblOmniMapedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
