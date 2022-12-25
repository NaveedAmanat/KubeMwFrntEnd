import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClntInfoJazzDuesComponent } from './clnt-info-jazz-dues.component';

describe('ClntInfoJazzDuesComponent', () => {
  let component: ClntInfoJazzDuesComponent;
  let fixture: ComponentFixture<ClntInfoJazzDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClntInfoJazzDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClntInfoJazzDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
