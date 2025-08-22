import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ButtonComponent, IUser } from '../../../shared';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    NgbDropdownModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService);
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
    this.authService.loginSubmit();
  }

  async signUp() {
    this.authService.signupSubmit().subscribe();
  }

  logout() {
    this.authService.logout();
  }

  postProperty() {
    this.router.navigate(['/property/add']);
  }
}
