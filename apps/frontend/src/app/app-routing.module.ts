import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutesConfig } from "./config/routes.config";
import { AuthGuard } from "./guards/auth.guard";


const routes: Routes = [
  // Dashboard
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full'
  // },
  // Auth routes
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule)
      },
      {
        path: 'app',
        loadChildren: () => import("./modules/core/core.module").then(m => m.CoreModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/app',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '**', redirectTo: RoutesConfig.routes.error404
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
