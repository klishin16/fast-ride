import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { HeaderComponent } from './header/header.component';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { IconsProviderModule } from "../../icons-provider.module";
import { FooterComponent } from './footer/footer.component';
import { NzMenuModule } from "ng-zorro-antd/menu";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "../../directives/directives.module";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NgZorroAntdModule } from "../../ng-zorro-antd.module";



@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    IconsProviderModule,
    NzMenuModule,
    RouterModule.forChild([]),
    DirectivesModule,
    NzAvatarModule,
    NgZorroAntdModule
  ]
})
export class MainLayoutModule { }
