import { async, ComponentFixture, TestBed } from 'node_modules/@angular/core/testing';

import { ClientHealthBeneficiaryComponent } from './client-health-beneficiary.component';

describe('ClientHealthBeneficiaryComponent', () => {
  let component: ClientHealthBeneficiaryComponent;
  let fixture: ComponentFixture<ClientHealthBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHealthBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHealthBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
