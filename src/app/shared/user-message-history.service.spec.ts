import { TestBed } from '@angular/core/testing';

import { UserMessageHistoryService } from './user-message-history.service';

describe('UserMessageHistoryService', () => {
  let service: UserMessageHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMessageHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
