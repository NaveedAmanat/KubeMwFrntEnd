import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyPaisaLetterComponent } from './easy-paisa-letter.component';

describe('EasyPaisaLetterComponent', () => {
  let component: EasyPaisaLetterComponent;
  let fixture: ComponentFixture<EasyPaisaLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasyPaisaLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyPaisaLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
