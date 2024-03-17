import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { format, fromUnixTime } from 'date-fns';

import { UserService, MessageService } from 'services';

import { ChatMessageComponent } from 'components/chat/chat-message/chat-message.component';

import { AvatarComponent } from 'components';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.sass'],
  standalone: true,
  imports: [RouterLink, ChatMessageComponent, AvatarComponent],
})
export class ChatsComponent implements OnInit {
  items: any = [];
  user: any;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.messageService.chats().subscribe((data) => {
      console.log(data.items);

      const result: any = [];
      data.items.forEach((element: any) =>
        result.push(this.getPrepareItem(element))
      );

      this.items = result;
    });

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  getChatId(item: any) {
    return item.sender.id !== this.user.id ? item.sender.id : item.recipient.id;
  }

  getPrepareItem(item: any) {
    return {
      id: item.id,
      chat_id: this.getChatId(item),
      name:
        item.sender.id !== this.user.id
          ? item.sender.username
          : item.recipient.username,
      text: item.text,
      timestamp: item.updated_at,
      date: format(fromUnixTime(item.updated_at), 'dd.MM.yyyy'),
      avatar: '1',
      status: 2,
      self: false,
    };
  }
}
