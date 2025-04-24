import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ClienteComponent} from './cliente/cliente.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
 {
    path: 'cliente', component: ClienteComponent
  }
];
