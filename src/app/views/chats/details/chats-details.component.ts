import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';
import { ChatMessageComponent } from 'components/chat/chat-message/chat-message.component';

import { MessageService } from 'services';

@Component({
  selector: 'app-chats-details',
  templateUrl: './chats-details.component.html',
  styleUrls: ['./chats-details.component.sass'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputModule,
    ButtonComponent,
    ChatMessageComponent,
  ],
})
export class ChatsDetailsComponent implements OnInit, AfterViewChecked {
  items: any = [];
  tempItems: any = [];

  ready = false;
  loading = false;
  needScroll = true;

  userId: number = 0;
  user: any;

  subscribes: any = {};

  //validators = [Validators.required];

  form = this.fb.group({
    text: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = Number(params['id']) || 0;

      if (!this.ready && this.userId > 0) {
        this.loading = true;

        this.messageService.all(this.userId).subscribe((x) => {
          this.loading = false;
          this.ready = true;

          this.user = x.user;
          this.items = [...x.messages.items].map((item) => {
            return {
              id: item.id,

              text: item.text,
              date: 1020230303,

              status: item.status,
              self: this.userId === item.recipient.id,
            };
          });
          console.log('!!', this.items);
        });
      } else {
      }
    });
  }

  ngAfterViewChecked() {
    if (this.ready && this.needScroll) {
      this.needScroll = false;
      this.scrollToBottom();
      console.log('scroll');
    }
  }

  scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
    // this.scrollContainer.nativeElement.scrollHeight;
  }

  get text() {
    return this.form.get('text')!;
  }

  getUsername() {
    console.log(this.items);
    if (!this.items.length) return '';

    return this.userId === this.items[0].sender.id
      ? this.items[0].sender.username
      : this.items[0].recipient.username;
  }

  onSubmit() {
    const value = this.text.value?.trim();

    const tempItemsLength = this.tempItems.length;

    const tempId =
      tempItemsLength === 0 ? 1 : this.tempItems[tempItemsLength - 1].id + 1;

    const tId = 't01';

    if (value?.length) {
      const formData = {
        recipient_id: this.userId,
        text: value,
      };

      const tempData = {
        id: tId,
        sender: {
          id: 1,
        },
        recipient: {
          id: this.userId,
        },
        text: value,
        status: -1,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      this.items.push({ ...tempData, self: true });
      let msg = this.items[this.items.length - 1];
      this.messageService.create(formData).subscribe((data) => {
        //this.items.push({ ...data, self: true });
        msg.status = data.status;

        this.needScroll = true;
      });

      this.text.setValue('');
    }
  }
}
