import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingClientsComponent } from './pending-clients.component';

describe('PendingClientsComponent', () => {
  let component: PendingClientsComponent;
  let fixture: ComponentFixture<PendingClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
