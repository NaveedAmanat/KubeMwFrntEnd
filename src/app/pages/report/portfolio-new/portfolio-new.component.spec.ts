import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioNewComponent } from './portfolio-new.component';

describe('PortfolioNewComponent', () => {
  let component: PortfolioNewComponent;
  let fixture: ComponentFixture<PortfolioNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
