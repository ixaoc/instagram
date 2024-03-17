import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';

@Injectable()
export class FormService {
  errorService: any = new ErrorService();

  component: any;
  elementRef: any;
  form: any;
  validators: any;

  init(component: any) {
    const { el, form, validators } = component;

    this.component = component;
    this.elementRef = el;
    this.form = form;
    this.validators = validators;
  }

  focus(field: string) {
    // @ts-ignore
    this.component[field]?.nativeElement?.focus();
  }

  validate() {
    const { errorService, form, validators } = this;

    const errors = this.errorService.items;
    let isFocus = false;

    if (Object.keys(errors).length) {
      const field = Object.keys(errors)[0];

      if (!isFocus) {
        this.focus(field);
        isFocus = true;
      }

      return false;
    }

    if (!form.valid) {
      for (const [field, value] of Object.entries(form.controls)) {
        const errors = form.get(field)?.errors;

        if (errors) {
          const errorKey = Object.keys(errors)[0];

          if (!isFocus) {
            this.focus(field);
            isFocus = true;
          }

          errorService.add(field, validators[field][errorKey]['error']);
        }
      }

      return false;
    }

    return true;
  }

  addError(field: string, key: string) {
    this.errorService.add(field, this.validators[field][key]['error']);
  }

  addServerError(error: any) {
    let isFocus = false;

    for (const [key, value] of Object.entries(error)) {
      if (error.type && error.type === 'yii\\web\\HttpException') {
      } else {
        this.errorService.add(key, value as string);

        if (!isFocus) {
          this.focus(key);
          isFocus = true;
        }
      }
    }

    return true;
  }
}
