import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelenorCollectionComponent } from './telenor-collection.component';

describe('TelenorCollectionComponent', () => {
  let component: TelenorCollectionComponent;
  let fixture: ComponentFixture<TelenorCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelenorCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelenorCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
