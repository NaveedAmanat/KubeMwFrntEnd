import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpaisaDuesSharingComponent } from './upaisa-dues-sharing.component';

describe('UpaisaDuesSharingComponent', () => {
  let component: UpaisaDuesSharingComponent;
  let fixture: ComponentFixture<UpaisaDuesSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpaisaDuesSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpaisaDuesSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
