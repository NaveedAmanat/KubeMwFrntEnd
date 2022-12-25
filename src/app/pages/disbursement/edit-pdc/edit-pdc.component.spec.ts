import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPdcComponent } from './edit-pdc.component';

describe('EditPdcComponent', () => {
  let component: EditPdcComponent;
  let fixture: ComponentFixture<EditPdcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPdcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
