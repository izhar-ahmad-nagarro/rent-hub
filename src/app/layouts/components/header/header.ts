import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Button } from '../../../shared';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginSignupModal } from '../../../features/auth/services/login-signup-modal';
import { AuthService } from '../../../features';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../../features/home/services';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    ReactiveFormsModule,
    CommonModule,
    NgbDropdownModule,
    RouterModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  authService = inject(AuthService);
  private loginSignupModal = inject(LoginSignupModal);
  private router = inject(Router);
  searchService = inject(SearchService);
  currentUrl = signal<string>('');
  isHomePage = computed(() => this.currentUrl() === '/home');
  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
    effect(() => {
      const user = this.authService.currentUser();
      console.log(user, '>>>>>>>>>>>>>>>>>>>>.');
    });
  }

  async login() {
    const result = await this.loginSignupModal.openLogin();
    this.authService.loginUser(result);
  }

  async signUp() {
    const result = await this.loginSignupModal.openSignup();
    await this.authService.saveUser(result);
  }

  logout() {
    this.authService.logout();
  }

  postProperty() {
    this.router.navigate(['/add-property']);
  }
}
