import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoClientDataComponent } from './wo-client-data.component';

describe('WoClientDataComponent', () => {
  let component: WoClientDataComponent;
  let fixture: ComponentFixture<WoClientDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoClientDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoClientDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
