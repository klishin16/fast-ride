import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapComponent } from "./map.component";
import { NewReviewComponent } from "./new-review/new-review.component";
import { NgZorroAntdModule } from "../../../ng-zorro-antd.module";
import { FormsModule } from "@angular/forms";
import { FeatureDetailComponent } from './feature-detail/feature-detail.component';


@NgModule({
  declarations: [
    MapComponent,
    NewReviewComponent,
    FeatureDetailComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ]
})
export class MapModule { }
