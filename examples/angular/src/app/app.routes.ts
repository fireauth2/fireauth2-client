import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { Route } from '@angular/router';

const redirectLoggedInToHome = () => redirectLoggedInTo('/');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('/login');

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./presentation/routes/login/login.page'),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: '',
    loadComponent: () => import('./presentation/routes/admin/admin.page'),
    ...canActivate(redirectUnauthorizedToLogin),
  },
];
