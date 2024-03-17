import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlDirective } from 'directives/control.directive';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoaderService, AuthService, FormService } from 'services';
import { searchValidatorsFn, compare } from 'helpers/form.helper';
import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';

@Component({
  selector: 'app-auth-recovery-init-form',
  templateUrl: './recovery-init-form.component.html',
  styleUrls: ['./recovery-init-form.component.sass'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ControlDirective,
    InputModule,
    ButtonComponent,
  ],
})
export class RecoveryInitFormComponent {
  subscribes: any = {};

  loading!: boolean;
  get errors() {
    return this.formService.errorService.items;
  }

  @Output() complete = new EventEmitter<void>();

  // ------------------

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
  };

  getValidatorsByName(name: string) {
    return searchValidatorsFn(this.validators, name);
  }

  // ------------------

  form = this.fb.group({
    email: ['', this.getValidatorsByName('email')],
  });

  get email() {
    return this.form.get('email')!;
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
      this.loading = !!data['auth/initRecovery'];
      this.ref.markForCheck();
    });
  }

  // ------------------

  change(field: string) {
    this.formService.errorService.remove(field);
  }

  submit() {
    if (this.formService.validate()) {
      this.authService.initRecovery(this.email.value as string).subscribe(
        () => {
          this.complete.emit();
        },
        ({ error }) => {
          this.formService.addServerError(error);
        }
      );
    }
  }
}
