import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicQnaComponent } from './public-qna.component';

describe('PublicQnaComponent', () => {
  let component: PublicQnaComponent;
  let fixture: ComponentFixture<PublicQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
