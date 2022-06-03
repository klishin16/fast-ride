import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { GraphQLModule } from './graphql.module';
import { RootModule } from "./modules/root/root.module";
import { MinimalLayoutModule } from "./layouts/minimal-layout/minimal-layout.module";
import { AuthModule } from "./modules/auth/auth.module";
import { MainLayoutModule } from "./layouts/main-layout/main-layout.module";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    GraphQLModule,
    RootModule,
    // Layouts
    MinimalLayoutModule,
    MainLayoutModule,

    AuthModule
    // RouterModule.forRoot([], { preloadingStrategy: PreloadAllModules }),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
