import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService, ProfileService } from 'services';

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.sass'],
  providers: [ProfileService],
  standalone: true,
  imports: [RouterOutlet],
})
export class ProfileSectionComponent {
  @Input() set username(value: string) {
    this.userService.getInfo(value).subscribe((user) => {
      this.profileService.setUser(user);
    });
  }

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) {}
}
