import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteListEmptyTextComponent } from './infinite-list-empty-text.component';

describe('InfiniteListEmptyTextComponent', () => {
  let component: InfiniteListEmptyTextComponent;
  let fixture: ComponentFixture<InfiniteListEmptyTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteListEmptyTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfiniteListEmptyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
