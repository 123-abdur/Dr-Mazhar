import { TestBed } from '@angular/core/testing';

import { DespenserGuard } from './despenser.guard';

describe('DespenserGuard', () => {
  let guard: DespenserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DespenserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
