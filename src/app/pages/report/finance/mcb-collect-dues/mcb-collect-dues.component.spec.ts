import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McbCollectDuesComponent } from './mcb-collect-dues.component';

describe('McbCollectDuesComponent', () => {
  let component: McbCollectDuesComponent;
  let fixture: ComponentFixture<McbCollectDuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McbCollectDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McbCollectDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
