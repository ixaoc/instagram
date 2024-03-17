import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppService, MessageService } from 'services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class AppComponent {
  ready!: boolean;

  constructor(
    private appService: AppService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onopen = () => {};
    ws.onerror = (error: any) => {};

    ws.onclose = (e) => {};

    ws.onmessage = (e) => {};

    this.appService.ready$.subscribe((status) => {
      this.ready = status;
    });
  }
}
