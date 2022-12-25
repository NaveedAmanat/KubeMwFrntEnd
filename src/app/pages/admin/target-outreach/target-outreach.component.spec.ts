import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetOutreachComponent } from './target-outreach.component';

describe('TargetOutreachComponent', () => {
  let component: TargetOutreachComponent;
  let fixture: ComponentFixture<TargetOutreachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetOutreachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetOutreachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
