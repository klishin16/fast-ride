import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from "../../layouts/main-layout/main-layout.component";
import { MapComponent } from "./map/map.component";
import { CommentsComponent } from "./pages/comments/comments.component";
import { ReviewsComponent } from "./pages/reviews/reviews.component";
import { FeaturesComponent } from "./pages/features/features.component";
import { UsersComponent } from "./pages/users/users.component";
import { MyReviewsComponent } from "./pages/my-reviews/my-reviews.component";

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'map',
        component: MapComponent
      },
      {
        path: 'my-reviews',
        component: MyReviewsComponent
      },
      {
        path: 'admin/users',
        component: UsersComponent
      },
      {
        path: 'admin/reviews',
        component: ReviewsComponent
      },
      {
        path: 'admin/features',
        component: FeaturesComponent
      },
      {
        path: 'admin/comments',
        component: CommentsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
