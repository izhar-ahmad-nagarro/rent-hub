import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Button, IUser } from '../../../shared';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginSignupModal } from '../../../features/auth/services/login-signup-modal';
import { AuthService } from '../../../features';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../../features/home/services';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';

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
  private alertService = inject(AlertService);
  isHomePage = computed(() => this.currentUrl() === '/home');
  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
    effect(() => {
      const user = this.authService.currentUser();
    });
  }

  async login() {
    const result = await this.loginSignupModal.openLogin();
    const user = await this.authService.loginUser(result);
    if (!user) {
      this.alertService.error('Invalid email or password');
    }
  }

  async signUp() {
    const modalRef = await this.loginSignupModal.openSignup();
    modalRef.componentInstance.signupUser.subscribe(async (res: IUser) => {
      const result = await this.authService.saveUser(res);
      if (result.success) {
        this.alertService.success(result.message);
        modalRef.close();
      } else {
        this.alertService.error(result.message);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  postProperty() {
    this.router.navigate(['/property/add']);
  }
}
