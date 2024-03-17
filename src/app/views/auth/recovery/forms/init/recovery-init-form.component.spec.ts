import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryInitFormComponent } from './recovery-init-form.component';

describe('RecoveryInitFormComponent', () => {
  let component: RecoveryInitFormComponent;
  let fixture: ComponentFixture<RecoveryInitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryInitFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryInitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
