import { TestBed } from '@angular/core/testing';

import { AdminDespenserGuard } from './admin-despenser.guard';

describe('AdminDespenserGuard', () => {
  let guard: AdminDespenserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminDespenserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
