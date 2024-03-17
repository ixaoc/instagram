import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBookmarkComponent } from './icon-bookmark.component';

describe('IconBookmarkComponent', () => {
  let component: IconBookmarkComponent;
  let fixture: ComponentFixture<IconBookmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBookmarkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
