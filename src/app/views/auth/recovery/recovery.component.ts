import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap, switchMap } from 'rxjs/operators';

import { AuthService } from 'services';

import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';

import { RecoveryInitFormComponent } from './forms/init/recovery-init-form.component';
import { RecoveryChangeFormComponent } from './forms/change/recovery-change-form.component';

@Component({
  selector: 'app-auth-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    InputModule,
    ButtonComponent,
    RecoveryInitFormComponent,
    RecoveryChangeFormComponent,
  ],
})
export class RecoveryComponent implements OnInit {
  loading = false;
  checking = false;

  step = 1;
  key = '';

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const key = params.get('key');
      console.log(key);

      if (key !== null) {
        this.key = key;
        this.step = 3;

        this.checkKey(key);
      }
    });
  }

  checkKey(key: string) {
    this.checking = true;

    this.authService
      .checkRecoveryKey(key)
      .pipe(
        finalize(() => {
          this.checking = false;
          this.ref.markForCheck();
        })
      )
      .subscribe(
        (value) => {},
        (err) => {
          console.log(err);
        }
      );
  }

  submitInitForm() {
    this.step = 2;
  }

  submitChangeForm() {}
}
