import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { routesGuards } from '../../src/app/guards/routes.guard';


describe('routesGuard', () => {  
  const route = {
    url: [],
    params: {},
    queryParams: {},
    fragment: '' 
  } as unknown as ActivatedRouteSnapshot;

  const state = {
    url: '',
    root: route
  } as unknown as RouterStateSnapshot;    
  
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routesGuards(...guardParameters));
      

  beforeEach(() => {
    TestBed.configureTestingModule({});   
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should get false if its not token on localStorage', () => {
    localStorage.removeItem('token'); 
    const result = executeGuard(route, state);
    expect(result).toBeFalsy();
  });

  it('should get true if its token on localStorage', () => {
    localStorage.setItem('token', '123'); 
    const result = executeGuard(route, state);
    expect(result).toBeTruthy();
  });
});
