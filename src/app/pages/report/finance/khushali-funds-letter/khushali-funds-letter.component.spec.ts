import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhushaliFundsLetterComponent } from './khushali-funds-letter.component';

describe('KhushaliFundsLetterComponent', () => {
  let component: KhushaliFundsLetterComponent;
  let fixture: ComponentFixture<KhushaliFundsLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhushaliFundsLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhushaliFundsLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
