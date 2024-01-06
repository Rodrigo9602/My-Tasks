import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';


import { Toast } from '../global/toast.global';


export const routesGuards: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  let token = localStorage.getItem('token');

  if (!token) {
    Toast.fire({
      icon: 'error',
      title: 'You can not access routes manually',
    });

    router.navigate(['/']);
    return false;

  } else {
    return true;
  }

};