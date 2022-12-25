import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsRuleComponent } from './rs-rule.component';

describe('RsRuleComponent', () => {
  let component: RsRuleComponent;
  let fixture: ComponentFixture<RsRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
