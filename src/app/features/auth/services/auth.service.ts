import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { db } from '../../../db/app.db';
import { LoginSignupModalService } from './login-signup-modal.service';
import { AlertService } from '../../../shared/services/alert.service';
import { map, Observable } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IUser, UserRole } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'users';
  private readonly currentUserStorageKey = 'currentUser';
  private readonly http = inject(HttpClient);
  private loginSignupModalService = inject(LoginSignupModalService);
  private alertService = inject(AlertService);
  
  // Signal for current user state
  private _currentUser = signal<IUser | null>(this.loadUserFromStorage());

  // Public readonly signal
  readonly currentUser = computed(() => this._currentUser());

  // Derived signal: is user logged in?
  readonly isLoggedIn = computed(() => !!this._currentUser());

  readonly isLandLord = computed(
    () => this._currentUser()?.role === UserRole.LandLord
  );

  readonly currentUserRole = computed(
    () => this._currentUser()?.role
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
    const existingUser = (await db.users.where('email').equalsIgnoreCase(user.email).toArray())?.[0];
    if (existingUser) {
      return {
        success: false,
        message: 'user already exists',
      };
    }
    db.users.add(user);
    return { success: true, message: 'user added successfully' };
  }

  async loginSubmit() {
    const result = await this.loginSignupModalService.openLogin();
    const user = await this.loginUser(result);
    if (!user) {
      this.alertService.error('Invalid email or password');
    }
    return user;
  }

  signupSubmit(): Observable<unknown> {
    const modalRef = this.loginSignupModalService.openSignup();
    return modalRef.componentInstance.signupUser.pipe(map(async (res: IUser) => {
      this.signup(res, modalRef)
    }));
  }

  async signup(user: IUser, modalRef: NgbModalRef) {
    const result = await this.saveUser(user);
      if (result.success) {
        this.alertService.success(result.message);
        modalRef.close();
      } else {
        this.alertService.error(result.message);
      }
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
