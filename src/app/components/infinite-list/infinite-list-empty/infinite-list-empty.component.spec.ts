import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteListEmptyComponent } from './infinite-list-empty.component';

describe('InfiniteListEmptyComponent', () => {
  let component: InfiniteListEmptyComponent;
  let fixture: ComponentFixture<InfiniteListEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteListEmptyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfiniteListEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
