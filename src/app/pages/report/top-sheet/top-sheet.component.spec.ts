import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSheetComponent } from './top-sheet.component';

describe('TopSheetComponent', () => {
  let component: TopSheetComponent;
  let fixture: ComponentFixture<TopSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
