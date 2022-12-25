import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTagListComponent } from './client-tag-list.component';

describe('ClientTagListComponent', () => {
  let component: ClientTagListComponent;
  let fixture: ComponentFixture<ClientTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
