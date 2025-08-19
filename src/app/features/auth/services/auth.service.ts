import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { IUser, UserRole } from '../../home/interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'users';
  private readonly currentUserStorageKey = 'currentUser';
  private readonly http = inject(HttpClient);
  
  // Signal for current user state
  private _currentUser = signal<IUser | null>(this.loadUserFromStorage());

  // Public readonly signal
  readonly currentUser = computed(() => this._currentUser());

  // Derived signal: is user logged in?
  readonly isLoggedIn = computed(() => !!this._currentUser());

  readonly isLandLord = computed(()=> this._currentUser()?.role === UserRole.LandLord)

  constructor() {
    effect(() => {
      const user = this._currentUser();
      if (user) {
        localStorage.setItem(this.currentUserStorageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.currentUserStorageKey);
      }
    });
  }

  getUsers() {
    return of(JSON.parse(localStorage.getItem(this.storageKey) || '[]'));
  }

  async saveUser(user: IUser) {
    const users = await this.getUsers().toPromise();
    users.push(user);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return { success: true };
  }

  async loginUser(payload: { email: string; password: string }) {
    const usersUrl = 'assets/data/users.json';
    let users = await this.http.get<IUser[]>(usersUrl).toPromise();
    let storageUsers = await this.getUsers().toPromise();
    let validUser = users?.find(
      (u) => u.email === payload.email && u.password === payload.password
    ) ?? null;
    if (!validUser) {
      validUser = storageUsers?.find(
        (u: IUser) =>
          u.email === payload.email && u.password === payload.password
      );
    }
    this._currentUser.set(validUser);
    return validUser;
  }

  logout() {
    this._currentUser.set(null);
  }

   private loadUserFromStorage(): IUser | null {
    const raw = localStorage.getItem(this.currentUserStorageKey);
    return raw ? JSON.parse(raw) : null;
  }
}
