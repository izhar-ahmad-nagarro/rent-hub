import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'users';
  private readonly http = inject(HttpClient);

  getUsers() {
    return of(JSON.parse(localStorage.getItem(this.storageKey) || '[]'));
  }

  async saveUser(user: any) {
    const users = await this.getUsers().toPromise();
    users.push(user);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return { success: true };
  }
}
