import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinimalLayoutComponent } from './minimal-layout.component';
import { RouterModule } from "@angular/router";
import { NzLayoutModule } from "ng-zorro-antd/layout";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    NzLayoutModule
  ],
  declarations: [
    MinimalLayoutComponent
  ],
  exports: [
    MinimalLayoutComponent,
  ]
})
export class MinimalLayoutModule { }
