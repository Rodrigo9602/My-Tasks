import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routesGuards } from '../../src/app/guards/routes.guard';

describe('routesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routesGuards(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
