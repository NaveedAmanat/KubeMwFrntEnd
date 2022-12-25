import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnicExpiryComponent } from './cnic-expiry.component';

describe('CnicExpiryComponent', () => {
  let component: CnicExpiryComponent;
  let fixture: ComponentFixture<CnicExpiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnicExpiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnicExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
