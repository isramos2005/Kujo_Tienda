import { TestBed } from '@angular/core/testing';

import { AcceService } from './acce.service';

describe('AcceService', () => {
  let service: AcceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
