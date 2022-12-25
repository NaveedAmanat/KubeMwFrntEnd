import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyPaisaLoaderComponent } from './easy-paisa-loader.component';

describe('EasyPaisaLoaderComponent', () => {
  let component: EasyPaisaLoaderComponent;
  let fixture: ComponentFixture<EasyPaisaLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasyPaisaLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyPaisaLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
