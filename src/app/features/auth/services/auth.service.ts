import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { IUser, UserRole } from '../../home/interface';
import { db } from '../../../db/app.db';

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

  readonly isLandLord = computed(
    () => this._currentUser()?.role === UserRole.LandLord
  );

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
    console.log('userrr', user);
    const existingUser = (await db.users.where('email').equalsIgnoreCase(user.email).toArray())?.[0];
    console.log(existingUser, 'existingUserexistingUser')
    if (existingUser) {
      return {
        success: false,
        message: 'user already exists',
      };
    }
    db.users.add(user);
    return { success: true, message: 'user added successfully' };
  }

  async loginUser(payload: { email: string; password: string }) {
    const user = await db.users
      .where('email')
      .equalsIgnoreCase(payload.email)
      .first();
    if (!user) {
      return null;
    }
    if (user.password === payload.password) {
      this._currentUser.set(user);

      return user; 
    }

    return null;
  }

  logout() {
    this._currentUser.set(null);
  }

  private loadUserFromStorage(): IUser | null {
    const raw = localStorage.getItem(this.currentUserStorageKey);
    return raw ? JSON.parse(raw) : null;
  }
}
