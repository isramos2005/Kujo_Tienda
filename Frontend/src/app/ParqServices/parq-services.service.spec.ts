import { TestBed } from '@angular/core/testing';

import { ParqServicesService } from './parq-services.service';

describe('ParqServicesService', () => {
  let service: ParqServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParqServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
