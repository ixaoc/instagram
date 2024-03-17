import { ElementRef } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function searchValidatorsFn(value: any, name: string) {
  const data = [];

  for (const [key, val] of Object.entries(value[name])) {
    data.push((val as any).validator);
  }

  return data;
}

export function compare(compareField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const sourceField = control?.parent?.value?.[compareField];
    const field = control?.value;

    if (!sourceField && !field) {
      return null;
    }

    return sourceField !== field ? { compare: false } : null;
  };
}
