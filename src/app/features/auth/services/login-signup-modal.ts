import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Login } from '../components/login/login';
import { SignUp } from '../components/sign-up/sign-up';

@Injectable({
  providedIn: 'root'
})
export class LoginSignupModal {
  private readonly modalService = inject(NgbModal);
  openLogin(): Promise<any> {
    const modalRef = this.modalService.open(Login, {
      centered: true,
      backdrop: 'static',
    });
    return modalRef.result;
  }

  openSignup(): Promise<any> {
    const modalRef = this.modalService.open(SignUp, {
      centered: true,
      backdrop: 'static',
    });
    return modalRef.result;
  }

}
