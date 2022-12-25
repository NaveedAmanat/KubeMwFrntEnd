import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalMissingTagComponent } from './animal-missing-tag.component';

describe('AnimalMissingTagComponent', () => {
  let component: AnimalMissingTagComponent;
  let fixture: ComponentFixture<AnimalMissingTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalMissingTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalMissingTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
