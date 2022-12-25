import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UblOmniDuesComponent } from './ubl-omni-dues.component';

describe('UblOmniDuesComponent', () => {
  let component: UblOmniDuesComponent;
  let fixture: ComponentFixture<UblOmniDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UblOmniDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UblOmniDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
