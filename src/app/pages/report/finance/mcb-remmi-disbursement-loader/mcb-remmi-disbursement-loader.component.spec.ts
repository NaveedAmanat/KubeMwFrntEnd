import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McbRemmiDisbursementLoaderComponent } from './mcb-remmi-disbursement-loader.component';

describe('McbRemmiDisbursementLoaderComponent', () => {
  let component: McbRemmiDisbursementLoaderComponent;
  let fixture: ComponentFixture<McbRemmiDisbursementLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McbRemmiDisbursementLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McbRemmiDisbursementLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
