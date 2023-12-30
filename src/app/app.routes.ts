import { Routes } from '@angular/router';
import { routesGuards } from './guards/routes.guard';


export const routes: Routes = [
    {path: '', loadComponent: ()=>import('./pages/user/login/login.component').then(c=>c.LoginComponent)},
    {path: 'login', loadComponent: ()=>import('./pages/user/login/login.component').then(c=>c.LoginComponent)},
    {path: 'register', loadComponent: () => import('./pages/user/register/register.component').then(c => c.RegisterComponent)},
    {path: 'home', canActivate: [routesGuards], loadComponent: () => import('./pages/home/mainboard/mainboard.component').then(c => c.MainboardComponent)},
];
