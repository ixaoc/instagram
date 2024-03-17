import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type User = any;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private subject = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.subject.asObservable();

  setUser(user: User) {
    this.subject.next(user);
  }
}
