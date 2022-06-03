import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NgZorroAntdModule } from "../../ng-zorro-antd.module";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    NzLayoutModule,
    //NG-ZORRO
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent
  ]
})
export class AuthModule { }
