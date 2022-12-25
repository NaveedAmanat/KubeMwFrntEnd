import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BypassOdComponent } from './bypass-od.component';

describe('BypassOdComponent', () => {
  let component: BypassOdComponent;
  let fixture: ComponentFixture<BypassOdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BypassOdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BypassOdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
