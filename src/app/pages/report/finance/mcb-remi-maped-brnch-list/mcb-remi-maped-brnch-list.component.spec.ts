import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McbRemiMapedBrnchListComponent } from './mcb-remi-maped-brnch-list.component';

describe('McbRemiMapedBrnchListComponent', () => {
  let component: McbRemiMapedBrnchListComponent;
  let fixture: ComponentFixture<McbRemiMapedBrnchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McbRemiMapedBrnchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McbRemiMapedBrnchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
