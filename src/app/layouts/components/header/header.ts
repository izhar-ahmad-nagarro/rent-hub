import { Component, inject } from '@angular/core';
import { Button } from '../../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginSignupModal } from '../../../features/auth/services/login-signup-modal';
import { AuthService } from '../../../features';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private ngbModal = inject(NgbModal);
  private authService  = inject(AuthService)
  private loginSignupModal = inject(LoginSignupModal);
  login() {
    this.loginSignupModal.openLogin();
  }

  async signUp() {
    const result = await this.loginSignupModal.openSignup();
    const users = await this.authService.saveUser(result);
  }
}
