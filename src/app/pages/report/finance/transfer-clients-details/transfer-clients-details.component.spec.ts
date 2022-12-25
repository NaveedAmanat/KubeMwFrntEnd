import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferClientsDetailsComponent } from './transfer-clients-details.component';

describe('TransferClientsDetailsComponent', () => {
  let component: TransferClientsDetailsComponent;
  let fixture: ComponentFixture<TransferClientsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferClientsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferClientsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
