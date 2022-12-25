import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NadraDuesComponent } from './nadra-dues.component';

describe('NadraDuesComponent', () => {
  let component: NadraDuesComponent;
  let fixture: ComponentFixture<NadraDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NadraDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NadraDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
