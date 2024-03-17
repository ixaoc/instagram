import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { ControlDirective } from 'directives/control.directive';
import { searchValidatorsFn, compare } from 'helpers/form.helper';

import { LoaderService, AuthService, FormService } from 'services';

import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';

@Component({
  selector: 'app-auth-recovery-change-form',
  templateUrl: './recovery-change-form.component.html',
  styleUrls: ['./recovery-change-form.component.sass'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    ControlDirective,
    ReactiveFormsModule,
    InputModule,
    ButtonComponent,
  ],
})
export class RecoveryChangeFormComponent implements OnInit {
  subscribes: any = {};

  loading!: boolean;
  get errors() {
    return this.formService.errorService.items;
  }

  @Input() key!: string;
  @Output() complete = new EventEmitter<void>();

  checking: boolean = true;

  // ------------------

  passwordBaseValidators = {
    required: {
      validator: Validators.required,
      error: 'Необходимо заполнить',
    },
    minlength: {
      validator: Validators.minLength(6),
      error: 'Минимум 6 символов',
    },
    maxlength: {
      validator: Validators.maxLength(20),
      error: 'Максимум 20 символов',
    },
  };

  validators: any = {
    password: {
      ...this.passwordBaseValidators,
    },
    repeatPassword: {
      ...this.passwordBaseValidators,
      compare: {
        validator: compare('password'),
        error: 'Пароли не совпадают',
      },
    },
  };

  getValidatorsByName(name: string) {
    return searchValidatorsFn(this.validators, name);
  }

  // ------------------

  form = this.fb.group({
    password: ['', this.getValidatorsByName('password')],
    repeatPassword: ['', this.getValidatorsByName('repeatPassword')],
  });

  get password() {
    return this.form.get('password')!;
  }

  get repeatPassword() {
    return this.form.get('repeatPassword')!;
  }

  // ------------------

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private authService: AuthService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.formService.init(this);

    this.subscribes.loader = this.loaderService.items$.subscribe((data) => {
      this.loading = !!data['auth/setNewPassword'];
      this.ref.markForCheck();
    });
  }

  change(field: string) {
    this.formService.errorService.remove(field);
  }

  submit() {
    if (this.formService.validate()) {
      this.authService
        .setNewPassword(this.key, this.password.value as string)
        .subscribe(
          (value) => {
            this.complete.emit();
          },
          ({ error }) => {
            this.formService.addServerError(error);
          }
        );
    }
  }
}
