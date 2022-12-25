import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KszbClientDataComponent } from './kszb-client-data.component';

describe('KszbClientDataComponent', () => {
  let component: KszbClientDataComponent;
  let fixture: ComponentFixture<KszbClientDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KszbClientDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KszbClientDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
