import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCommentComponent } from './icon-comment.component';

describe('IconCommentComponent', () => {
  let component: IconCommentComponent;
  let fixture: ComponentFixture<IconCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCommentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
