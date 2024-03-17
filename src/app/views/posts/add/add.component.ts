import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import _ from 'lodash';
import { Subscription } from 'rxjs';

import { ControlDirective } from 'directives';
import { LoaderService, FormService, PostService } from 'services';
import { ButtonComponent, ModalComponent, InputModule } from 'components';

@Component({
  selector: 'app-add-post',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
  providers: [FormService],
  standalone: true,
  imports: [
    ControlDirective,
    ReactiveFormsModule,
    ModalComponent,
    InputModule,
    ButtonComponent,
  ],
})
export class AddComponent {
  loading!: boolean;
  subscriptions: Record<string, Subscription> = {};

  file: any = null;
  src: any = null;

  get errors() {
    return this.formService.errorService.items;
  }

  form = this.fb.group({
    description: [''],
  });

  get description() {
    return this.form.get('description')!;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private formService: FormService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.formService.init(this);

    this.subscriptions['loaderService/items'] =
      this.loaderService.items$.subscribe((data) => {
        this.loading = !!data['post/create'];
      });
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  setSrc(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      this.file = file;
      this.src = (event.target as any).result;
    };

    reader.readAsDataURL(file);
  }

  onDrop(event: any) {
    event.preventDefault();
    console.log(event.dataTransfer.files);

    this.setSrc(event.dataTransfer.files[0]);
  }

  onDragOver(event: any) {
    event.stopPropagation();
    event.preventDefault();
    //console.log(event);
  }

  onFileSelected(event: any) {
    console.log(event);
    this.setSrc(event.target.files[0]);
  }

  change(field: string) {
    this.formService.errorService.remove(field);
  }

  onClose() {
    this.router.navigate([{ outlets: { popup: null } }], {
      relativeTo: this.route.parent,
    });
  }

  submit() {
    console.log(this.formService);
    if (this.formService.validate()) {
      const formData = new FormData();

      formData.append('file', this.file);
      formData.append('description', this.description.value as string);

      this.postService.create(formData).subscribe(
        () => {
          this.onClose();
        },
        ({ error }) => {
          this.formService.addServerError(error);
        }
      );
    }
  }
}
