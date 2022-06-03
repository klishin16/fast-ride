import { Component, OnInit } from '@angular/core';
import { FeatureViewService } from "../../../../services/map/feature-view.service";

@Component({
  selector: 'app-feature-detail',
  templateUrl: './feature-detail.component.html',
  styleUrls: ['./feature-detail.component.scss']
})
export class FeatureDetailComponent implements OnInit {
  public new_comment_text?: string = undefined

  constructor(public feature_view_service: FeatureViewService) {
    this.feature_view_service.current_comments$.subscribe(f => {
      console.log(f);
    })
  }

  ngOnInit(): void {
  }

  public handleSubmitNewComment() {
    if (this.new_comment_text) {
      this.feature_view_service.createComment(this.new_comment_text)
    }
  }
}
