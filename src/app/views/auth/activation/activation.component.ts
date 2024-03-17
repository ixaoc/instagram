import {
  //ElementRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgClass } from '@angular/common';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { ControlDirective } from 'directives/control.directive';
import { LoaderService, FormService, AuthService } from 'services';
import { searchValidatorsFn } from 'helpers/form.helper';

import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';

@Component({
  selector: 'app-auth-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.sass'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    ControlDirective,
    InputModule,
    ButtonComponent,
  ],
})
export class ActivationComponent implements OnInit {
  subscribes: any = {};

  loading!: boolean;
  get errors() {
    return this.formService.errorService.items;
  }

  initialTime = 10;
  timer = this.initialTime;
  refreshRequest = 0;
  try = 0;

  get refreshTime() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer - minutes * 60;

    const formatted = (n: number) => ('0' + n).slice(-2);

    return `${formatted(minutes)}:${formatted(seconds)}`;
  }

  @Input() email: string = '';
  @Input() password: string = '';

  @Output() complete = new EventEmitter<void>();

  // ------------------

  validators: any = {
    code: {
      required: {
        validator: Validators.required,
        error: 'Необходимо заполнить',
      },
      minlength: {
        validator: Validators.minLength(6),
        error: 'Код должен состоять из 6 цифр',
      },
      maxlength: {
        validator: Validators.maxLength(6),
        error: 'Код должен состоять из 6 цифр',
      },
    },
  };

  getValidatorsByName(name: string) {
    return searchValidatorsFn(this.validators, name);
  }

  // ------------------

  form = this.fb.group({
    code: ['', this.getValidatorsByName('code')],
  });

  get code() {
    return this.form.get('code')!;
  }

  // ------------------

  constructor(
    //private el: ElementRef,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.formService.init(this);

    this.subscribes.loader = this.loaderService.items$.subscribe((data) => {
      this.loading = !!data['auth/activation'];
      this.ref.markForCheck();
    });

    setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.ref.markForCheck();
      }
    }, 1000);
  }

  // ------------------

  change(field: string) {
    this.formService.errorService.remove(field);
  }

  refreshCode() {
    if (this.timer === 0) {
      this.refreshRequest++;
      this.try = 0;
      this.timer = this.initialTime;

      this.authService
        .refreshActivationCode(this.email, this.password)
        .subscribe(
          () => {},
          ({ error }) => {
            this.formService.addServerError(error);
          }
        );

      setTimeout(() => {
        this.form.patchValue({
          code: '',
        });

        (this.code as any)?.nativeElement?.focus();
      }, 0);
    }
  }

  submit() {
    if (this.formService.validate()) {
      this.authService
        .activation(this.email, this.password, this.code.value as string)
        .subscribe(
          () => {
            this.complete.emit();
          },
          ({ error }) => {
            this.try++;
            this.formService.addServerError(error);
            this.formService.focus('code');

            this.form.patchValue({
              code: '',
            });
          }
        );
    }
  }
}
