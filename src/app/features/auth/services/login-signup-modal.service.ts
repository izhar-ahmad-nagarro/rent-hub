import { inject, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../components/login/login.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';

@Injectable({
  providedIn: 'root'
})
export class LoginSignupModalService {
  private readonly modalService = inject(NgbModal);
  openLogin(): Promise<any> {
    const modalRef = this.modalService.open(LoginComponent, {
      centered: true,
      backdrop: 'static',
    });
    return modalRef.result;
  }

  openSignup(): NgbModalRef {
    const modalRef = this.modalService.open(SignUpComponent, {
      centered: true,
      backdrop: 'static',
    });
    return modalRef;
  }

}
