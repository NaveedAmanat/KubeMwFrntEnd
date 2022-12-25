import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversedEntriesComponent } from './reversed-entries.component';

describe('ReversedEntriesComponent', () => {
  let component: ReversedEntriesComponent;
  let fixture: ComponentFixture<ReversedEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReversedEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReversedEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
