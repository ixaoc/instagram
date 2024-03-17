import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryChangeFormComponent } from './recovery-change-form.component';

describe('RecoveryChangeFormComponent', () => {
  let component: RecoveryChangeFormComponent;
  let fixture: ComponentFixture<RecoveryChangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryChangeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryChangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
