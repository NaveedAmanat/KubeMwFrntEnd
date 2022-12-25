import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyPaisaFundsComponent } from './easy-paisa-funds.component';

describe('EasyPaisaFundsComponent', () => {
  let component: EasyPaisaFundsComponent;
  let fixture: ComponentFixture<EasyPaisaFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasyPaisaFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyPaisaFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
