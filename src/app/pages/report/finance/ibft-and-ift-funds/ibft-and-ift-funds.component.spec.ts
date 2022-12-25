import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbftAndIftFundsComponent } from './ibft-and-ift-funds.component';

describe('IbftAndIftFundsComponent', () => {
  let component: IbftAndIftFundsComponent;
  let fixture: ComponentFixture<IbftAndIftFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbftAndIftFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbftAndIftFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
