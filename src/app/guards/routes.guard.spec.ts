import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routesGuard } from './routes.guard';

describe('routesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
