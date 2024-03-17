import { Component } from '@angular/core';
import { ControlDirective } from 'directives/control.directive';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'app/../environments/environment';

import { LoaderService, FormService, UserService } from 'services';
import { searchValidatorsFn } from 'helpers/form.helper';
import { ButtonComponent, InputModule } from 'components';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
  providers: [FormService],
  standalone: true,
  imports: [
    ControlDirective,
    ReactiveFormsModule,
    InputModule,
    ButtonComponent,
  ],
})
export class ProfileComponent {
  subscribes: any = {};

  loading!: boolean;
  ready: boolean = false;
  get errors() {
    return this.formService.errorService.items;
  }

  profile!: any;
  file: any = null;

  get avatar() {
    return `${environment.mediaPaths.avatar.thumb}/${this.profile['avatar']}`;
  }

  get _username() {
    return this.profile['username'];
  }

  // ------------------

  validators: any = {
    username: {
      required: {
        validator: Validators.required,
        error: 'Необходимо заполнить',
      },
    },
  };

  getValidatorsByName(name: string) {
    return searchValidatorsFn(this.validators, name);
  }

  // ------------------

  form = this.fb.group({
    username: ['', this.getValidatorsByName('username')],
  });

  get username() {
    return this.form.get('username')!;
  }

  // ------------------

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private userService: UserService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.formService.init(this);

    this.userService.getProfile().subscribe((profile) => {
      this.profile = profile;

      this.form.patchValue({
        username: profile.username,
      });
    });

    this.subscribes.loader = this.loaderService.items$.subscribe((data) => {
      this.ready = !data['user/getProfile'];
      this.loading = !!data['user/saveProfile'];
    });
  }

  // ------------------

  change(field: string) {
    this.formService.errorService.remove(field);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
    }
  }

  submit() {
    if (this.formService.validate()) {
      const formData = new FormData();
      console.log(this.userService);
      formData.append('avatar', this.file);
      formData.append('username', this.username.value as string);

      this.userService.update2(formData).subscribe(
        ({ username, avatar }) => {
          this.profile['username'] = username;
          this.profile['avatar'] = avatar;

          this.userService.setUser(this.profile);
        },
        ({ error }) => {
          this.formService.addServerError(error);
        }
      );
    }
  }
}
