import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';

import { ActivationComponent } from 'views/auth/activation/activation.component';
import { ControlDirective } from 'directives/control.directive';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoaderService, FormService, AuthService } from 'services';
import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';
import { searchValidatorsFn } from 'helpers/form.helper';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    ControlDirective,
    ReactiveFormsModule,
    InputModule,
    ButtonComponent,
    ActivationComponent,
  ],
})
export class LoginComponent implements OnInit {
  @HostBinding('class.page')
  host = true;

  subscribes: any = {};

  loading!: boolean;
  get errors() {
    return this.formService.errorService.items;
  }

  data: any = {};
  step = 1;

  // -----------------

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
    },
  };

  getValidatorsByName(name: string) {
    return searchValidatorsFn(this.validators, name);
  }

  // -----------------

  form = this.fb.group({
    email: ['', this.getValidatorsByName('email')],
    password: ['', this.getValidatorsByName('password')],
  });

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  get getEmail() {
    return this.email.value as string;
  }

  get getPassword() {
    return this.password.value as string;
  }

  // -----------------

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
      this.loading = !!data['auth/login'];
      this.ref.markForCheck();
    });
  }

  // -----------------

  change(field: string) {
    this.formService.errorService.remove(field);
  }

  submit() {
    if (this.formService.validate()) {
      this.authService
        .login(this.email.value as string, this.password.value as string)
        .subscribe(
          () => {},
          ({ error }) => {
            this.formService.addServerError(error);

            if (error.status) {
              switch (error.status) {
                case 1:
                  this.step = 2;
                  console.log(2, this.step);
                  this.ref.markForCheck();
                  break;
              }
            }
          }
        );
    }
  }
}
