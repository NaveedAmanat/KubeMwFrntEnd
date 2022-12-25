import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NactaManagementComponent } from './nacta-management.component';

describe('NactaManagementComponent', () => {
  let component: NactaManagementComponent;
  let fixture: ComponentFixture<NactaManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NactaManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NactaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
