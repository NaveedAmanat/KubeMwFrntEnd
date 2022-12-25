import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccTopsheetComponent } from './acc-topsheet.component';

describe('AccTopsheetComponent', () => {
  let component: AccTopsheetComponent;
  let fixture: ComponentFixture<AccTopsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccTopsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccTopsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
