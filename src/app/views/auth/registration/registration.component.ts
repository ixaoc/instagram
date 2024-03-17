import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ActivationComponent } from 'views/auth/activation/activation.component';
import { ControlDirective } from 'directives/control.directive';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderService, FormService, AuthService } from 'services';
import { searchValidatorsFn, compare } from 'helpers/form.helper';
import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';

@Component({
  selector: 'app-auth-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    ControlDirective,
    ActivationComponent,
    ReactiveFormsModule,
    InputModule,
    ButtonComponent,
  ],
})
export class RegistrationComponent implements OnInit {
  @HostBinding('class.page')
  host = true;

  subscribes: any = {};

  loading!: boolean;
  get errors() {
    return this.formService.errorService.items;
  }

  data: any = {};
  step = 1;

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
    email: {
      required: {
        validator: Validators.required,
        error: 'Необходимо заполнить',
      },
      email: {
        validator: Validators.email,
        error: 'Некорректный email',
      },
    },
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
    email: ['', this.getValidatorsByName('email')],
    password: ['', this.getValidatorsByName('password')],
    repeatPassword: ['', this.getValidatorsByName('repeatPassword')],
  });

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  get repeatPassword() {
    return this.form.get('repeatPassword')!;
  }

  get getEmail() {
    return this.email.value as string;
  }

  get getPassword() {
    return this.password.value as string;
  }

  // ------------------

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.formService.init(this);

    this.subscribes.loader = this.loaderService.items$.subscribe((data) => {
      this.loading = !!data['auth/registration'];
      this.ref.markForCheck();
    });
  }

  // ------------------

  change(field: string) {
    this.formService.errorService.remove(field);
  }

  submit() {
    if (this.formService.validate()) {
      this.authService
        .registration(this.email.value as string, this.password.value as string)
        .subscribe(
          () => {
            this.data.email = this.email.value as string;
            this.data.password = this.password.value as string;
            this.step = 2;
          },
          ({ error }) => {
            this.formService.addServerError(error);
          }
        );
    }
  }
}
