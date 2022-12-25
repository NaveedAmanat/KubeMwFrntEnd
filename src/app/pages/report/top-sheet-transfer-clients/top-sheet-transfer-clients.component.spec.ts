import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSheetTransferClientsComponent } from './top-sheet-transfer-clients.component';

describe('TopSheetTransferClientsComponent', () => {
  let component: TopSheetTransferClientsComponent;
  let fixture: ComponentFixture<TopSheetTransferClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopSheetTransferClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSheetTransferClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
