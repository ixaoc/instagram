import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private subject = new BehaviorSubject<boolean>(true);
  ready$: Observable<boolean> = this.subject.asObservable();

  //constructor(private http: HttpClient, public router: Router) {}

  // ready() {
  //   this.subject.next(true);
  // }
}
