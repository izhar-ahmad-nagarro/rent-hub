import { TestBed } from '@angular/core/testing';

import { UserQueryService } from './user-query.service';

describe('UserQueryService', () => {
  let service: UserQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
