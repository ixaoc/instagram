import { Component } from '@angular/core';
import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { UserService } from 'services';

import { InputModule } from 'components/input/input.module';

function compare(compareField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log(control);
    const newPassword = control?.parent?.value?.newPassword;
    const repeatNewPassword = control?.value;

    if (!newPassword && !repeatNewPassword) {
      return null;
    }

    return newPassword !== repeatNewPassword
      ? { compare: { value: 'Не совпадают' } }
      : null;
  };
}

@Component({
  selector: 'app-settings-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, InputModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass'],
})
export class ChangePasswordComponent {
  validators = [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
  ];

  errorTexts: Record<string, string> = {
    required: 'Необходимо заполнить',
    minlength: 'Минимум 6 символов',
    maxlength: 'Максимум 20 символов',
    compare: 'Пароли не совпадают',
  };

  showErrors: Record<string, boolean> = {
    currentPassword: false,
    newPassword: false,
    repeatNewPassword: false,
  };

  form = this.fb.group({
    currentPassword: ['', this.validators],
    newPassword: ['', this.validators],
    repeatNewPassword: ['', [...this.validators, compare('newPassword')]],
  });

  getFormError(field: string): string | undefined {
    if (!this.showErrors[field]) {
      return undefined;
    }

    const errors = this.form.get(field)?.errors;

    if (errors) {
      const errorKey = Object.keys(errors)[0];
      return this.errorTexts[errorKey];
    }

    return undefined;
  }

  get currentPassword() {
    return this.form.get('currentPassword')!;
  }

  get newPassword() {
    return this.form.get('newPassword')!;
  }

  get repeatNewPassword() {
    return this.form.get('repeatNewPassword')!;
  }

  constructor(private fb: FormBuilder, private userService: UserService) {}

  changeInput(field: string) {
    this.showErrors = {
      ...this.showErrors,
      [field]: false,
    };
  }

  onSubmit() {
    console.log(this.form);
    if (!this.form.valid) {
      this.showErrors = {
        currentPassword: !this.currentPassword.valid,
        newPassword: !this.newPassword.valid,
        repeatNewPassword: !this.repeatNewPassword.valid,
      };

      return;
    }
  }
}
