import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public redirectUrl: string;
  public expiredTokenSubject: Subject<boolean>;

  constructor() {
    this.expiredTokenSubject = new Subject();
  }

  public get Token() {
    return '22a69fbaa6c8e587bdf01799c3205079';
  }
}
