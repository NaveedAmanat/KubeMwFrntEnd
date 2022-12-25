import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnAroundTimeComponent } from './turn-around-time.component';

describe('TurnAroundTimeComponent', () => {
  let component: TurnAroundTimeComponent;
  let fixture: ComponentFixture<TurnAroundTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnAroundTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnAroundTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
