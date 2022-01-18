import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { isAuthenticationInProgress } from './utils';
import { AuthState } from './auth-state.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService extends RxState<AuthState>{
  private localStorage = window.localStorage;
  readonly redirectUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/movies/popular`;

  readonly requestToken$ = this.select('requestToken');
  readonly accessToken$ = this.select('accessToken');
  readonly accountId$ = this.select('accountId');
  readonly isAuthenticationInProgress$ = this.select(
    map(isAuthenticationInProgress)
  );

  constructor() {
    super();
    this.rebootStore();
    this.set({
      requestToken: this.localStorage.getItem('requestToken') || undefined,
      accessToken: this.localStorage.getItem('accessToken') || undefined,
      accountId: this.localStorage.getItem('accountId') || undefined,
    });
  }

  private rebootStore() {
    const requestToken = this.localStorage.getItem('requestToken') || undefined;
    if (requestToken !== undefined) {
      this.localStorage.removeItem('accessToken');
      this.localStorage.removeItem('accountId');
    }
    const accessToken = this.localStorage.getItem('accessToken') || undefined;
    if (accessToken !== undefined) {
      this.localStorage.removeItem('requestToken');
    } else {
      this.localStorage.removeItem('accountId');
    }
  }
}
