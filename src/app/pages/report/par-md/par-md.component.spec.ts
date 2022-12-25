import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParMdComponent } from './par-md.component';

describe('ParMdComponent', () => {
  let component: ParMdComponent;
  let fixture: ComponentFixture<ParMdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParMdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
