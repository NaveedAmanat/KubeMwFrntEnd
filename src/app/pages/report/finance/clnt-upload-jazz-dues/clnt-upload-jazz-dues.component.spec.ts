import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClntUploadJazzDuesComponent } from './clnt-upload-jazz-dues.component';

describe('ClntUploadJazzDuesComponent', () => {
  let component: ClntUploadJazzDuesComponent;
  let fixture: ComponentFixture<ClntUploadJazzDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClntUploadJazzDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClntUploadJazzDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
