import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagClientClaimComponent } from './tag-client-claim.component';

describe('TagClientClaimComponent', () => {
  let component: TagClientClaimComponent;
  let fixture: ComponentFixture<TagClientClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagClientClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagClientClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
