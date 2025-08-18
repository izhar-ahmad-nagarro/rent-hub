import { TestBed } from '@angular/core/testing';

import { LoginSignupModal } from './login-signup-modal';

describe('LoginSignupModal', () => {
  let service: LoginSignupModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSignupModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
