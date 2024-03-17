import { Component, Input, HostBinding } from '@angular/core';
import { environment } from 'app/../environments/environment';
import { AvatarComponent } from 'components';

interface Message {
  id: number;
  name?: any;
  text: string;
  avatar?: any;
  date: number;
  status: number;
  self: boolean;
}

@Component({
  selector: 'component-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.sass'],
  standalone: true,
  imports: [AvatarComponent],
})
export class ChatMessageComponent {
  @Input() item!: Message;

  @HostBinding('class.is-self')
  get self() {
    return this.item?.self;
  }

  getStatusClass(status: number) {
    return {
      status: true,
      'status--save': status === 0,
      'status--read': status === 1,
    };
  }

  getAvatar(avatar: string) {
    return avatar ? `${environment.apiUrl}/files/avatars/thumb/${avatar}` : '';
  }
}
