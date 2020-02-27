import { TestBed } from '@angular/core/testing';

import { DatabaseafterService } from './databaseafter.service';

describe('DatabaseafterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabaseafterService = TestBed.get(DatabaseafterService);
    expect(service).toBeTruthy();
  });
});
