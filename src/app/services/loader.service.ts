import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type Loaders = Record<string, boolean>;

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private data: Loaders = {};

  private items = new BehaviorSubject<Loaders>({});
  items$: Observable<Loaders> = this.items.asObservable();

  add(name: string): void {
    this.data[name] = true;
    this.items.next(this.data);
  }

  has(name: string): boolean {
    return this.data[name] ? true : false;
  }

  remove(name: string): void {
    delete this.data[name];
    this.items.next(this.data);
  }
}
