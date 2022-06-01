import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from "../../config/routes.config";
import { MinimalLayoutComponent } from "../../layouts/minimal-layout/minimal-layout.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";


const authenticationRoutes: Routes = [
  {
    path: '',
    component: MinimalLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'registration',
        component: RegistrationComponent
      },
      { path: '**', redirectTo: "/404" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
