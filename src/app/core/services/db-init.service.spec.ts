import { TestBed } from '@angular/core/testing';

import { DBInitService } from './db-init.service';

describe('DBInitService', () => {
  let service: DBInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
