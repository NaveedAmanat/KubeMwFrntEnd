import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NadraVerisysErrorStatusComponent } from './nadra-verisys-error-status.component';

describe('NadraVerisysErrorStatusComponent', () => {
  let component: NadraVerisysErrorStatusComponent;
  let fixture: ComponentFixture<NadraVerisysErrorStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NadraVerisysErrorStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NadraVerisysErrorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
