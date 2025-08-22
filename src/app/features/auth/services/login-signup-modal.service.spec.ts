import { TestBed } from '@angular/core/testing';

import { LoginSignupModalService } from './login-signup-modal.service';

describe('LoginSignupModalService', () => {
  let service: LoginSignupModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSignupModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
