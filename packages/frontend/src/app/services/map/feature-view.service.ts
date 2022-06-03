import { Injectable } from "@angular/core";
import { MapService } from "./map.service";
import { MainLayoutService } from "../main-layout.service";
import { Logger } from "../logger/logger";
import { map_map_priorities, withLatestFromFilter } from "./map.types";
import { BehaviorSubject, filter, tap } from "rxjs";
import {
  Comment,
  CreateCommentGQL,
  Feature,
  GetReviewCommentsGQL,
  GetReviewsGQL,
  Review
} from "../../graphql/generated/schema";
import { makeBox } from "./map-transforms.helper";
import { sourceLayersFilter, targetLayerFilter, targetLayersFilter } from "./map-filters.helper";
import { RoadsViewService } from "./roads-view.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { UsersService } from "../users.service";

@Injectable({
  providedIn: "root"
})
export class FeatureViewService {
  private logger = new Logger(FeatureViewService.name);

  private _current_feature$ = new BehaviorSubject<Feature | undefined>(undefined);

  private _current_feature_comments$ = new BehaviorSubject<Array<Comment> | undefined>(undefined)

  private _comments_loading$ = new BehaviorSubject<boolean>(false)

  private _new_comment_loading$ = new BehaviorSubject<boolean>(false)

  constructor(
    private map_service: MapService,
    private layoutService: MainLayoutService,
    private roads_view_service: RoadsViewService,
    private getReviewCommentsGQL: GetReviewCommentsGQL,
    private notificationService: NzNotificationService,
    private usersService: UsersService,
    private createCommentGQL: CreateCommentGQL
  ) {
    this.logger.info("Initialized");
    this.map_service.map_clicked$.pipe(
      withLatestFromFilter(this.layoutService.isFeatureDetailOpened$, (_, is_opened) => is_opened)
    ).subscribe((event) => {
      const features = this.map_service.mapboxMap?.queryRenderedFeatures(makeBox(event.point));
      if (!features?.length) {
        return;
      }
      const f1 = targetLayersFilter(features, ['roads-review']);
      if (!f1.length) {
        return;
      }
      const main_feature = f1[0]

      this._current_feature$.next(this.roads_view_service.features_data$.value?.find((f) => f.mapId === main_feature.id))
    })

    this._current_feature$.subscribe(feature => {
      if (!feature) {
        this._current_feature_comments$.next(undefined)
      } else {
        this._comments_loading$.next(true)
        this.getReviewCommentsGQL.fetch({
          reviewId: feature.review?.id
        }).pipe(
          tap(result => this._comments_loading$.next(result.loading)),
          filter(result => !result.loading)
        ).subscribe(response => {
          if (response.errors) {
            this.notificationService.error(
              "Comments",
              "Cannot fetch comments"
            )
            return
          }
          this._current_feature_comments$.next(response.data.comments.edges?.map(edge => edge.node as Comment))
        })
      }
    })
  }

  public createComment(text: string) {
    this._new_comment_loading$.next(true)
    this.createCommentGQL.mutate({
      data: {
        text,
        authorId: this.usersService.current_user$.value?.id,
        reviewId: this._current_feature$.value?.review?.id
      }
    }).pipe(
      tap(result => this._new_comment_loading$.next(result.loading)),
      filter(result => !result.loading)
    ).subscribe(response => {
      if (response.errors) {
        this.notificationService.error(
          "Comment",
          "Cannot create comment"
        )
        return
      }
      this._current_feature_comments$.next(this._current_feature_comments$.value!.concat([response.data?.createComment as Comment]))
    })
  }

  public get current_feature$() {
    return this._current_feature$
  }

  public get current_comments$() {
    return this._current_feature_comments$
  }

  public get comments_loading$() {
    return this._comments_loading$
  }

  public get new_comment_loading$() {
    return this._new_comment_loading$
  }
}
