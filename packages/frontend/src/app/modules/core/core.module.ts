import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { MapModule } from "./map/map.module";
import { CommentsComponent } from './pages/comments/comments.component';
import { NgZorroAntdModule } from "../../ng-zorro-antd.module";
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { FeaturesComponent } from './pages/features/features.component';
import { FormsModule } from "@angular/forms";
import { MyReviewsComponent } from './pages/my-reviews/my-reviews.component';


@NgModule({
  declarations: [
    UsersComponent,
    CommentsComponent,
    ReviewsComponent,
    FeaturesComponent,
    MyReviewsComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MapModule,
    NgZorroAntdModule,
    FormsModule
  ]
})
export class CoreModule { }
