import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'app/../environments/environment';

import _ from 'lodash';
import { Subscription } from 'rxjs';

import { ControlDirective } from 'directives';
import { LoaderService, FormService, PostService } from 'services';
import { ButtonComponent, ModalComponent, InputModule } from 'components';

@Component({
  selector: 'app-posts-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
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
export class EditComponent {
  ready = false;
  loading!: boolean;
  updating = false;
  subscriptions: Record<string, Subscription> = {};

  @Input() id!: number;
  item!: any;

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
    this.loadItem();

    this.subscriptions['loaderService/items'] =
      this.loaderService.items$.subscribe((data) => {
        this.loading = !!data['post/one'];
        this.updating = !!data[`post/update/${this.id}`];
      });
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  loadItem() {
    this.postService.one(this.id).subscribe((data) => {
      this.ready = true;
      this.item = data;

      this.form.patchValue({
        description: data.description,
      });
    });
  }

  getImage(files: any[]) {
    return `${environment.mediaPaths.post.original}/${files[0].file}`;
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
    if (this.formService.validate()) {
      const formData = new FormData();

      formData.append('description', this.description.value as string);
      console.log(this.item, formData);

      this.postService.update(this.item.id, formData).subscribe(
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
