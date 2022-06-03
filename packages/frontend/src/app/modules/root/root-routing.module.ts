import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";
import { RoutesConfig } from "../../config/routes.config";


const routesNames = RoutesConfig.routesNames;

const routes: Routes = [
  // { path: "/", component: HomePageComponent, pathMatch: 'full' },
  { path: routesNames.error404, component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
