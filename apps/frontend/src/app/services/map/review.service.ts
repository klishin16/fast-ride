import { Injectable } from "@angular/core";
import { findClosestToPintPath, sourceFilter, sourceLayersFilter, targetLayerFilter } from "./map-filters.helper";
import { ICommentFormModel, IReviewEstimationModel, map_map_priorities, withLatestFromFilter } from "./map.types";
import { MapService } from "./map.service";
import { BehaviorSubject, distinctUntilChanged, filter, lastValueFrom, tap } from "rxjs";
import { makeBox } from "./map-transforms.helper";
import { NzNotificationService } from "ng-zorro-antd/notification";
import {
  CreateCommentGQL,
  CreateEstimationGQL,
  CreateFeatureGQL,
  CreateReviewGQL, Estimation,
  Review,
  Comment as CommentModel,
  ReviewGQL, UpdateCommentGQL, UpdateEstimationGQL, UpdateFeatureGQL, UpdateReviewGQL, Feature
} from "../../graphql/generated/schema";
import { MainLayoutService } from "../main-layout.service";
import { Logger } from "../logger/logger";
import { UsersService } from "../users.service";
import { appendPathToPath, geoJsonPointToDbPoint } from "./map.helpers";
import { pick } from "lodash/fp";
import mapboxgl from "mapbox-gl";


@Injectable({
  providedIn: "root"
})
export class ReviewService {
  private logger = new Logger(ReviewService.name);
  /** Id текущего ревью */
  private _current_review = new BehaviorSubject<Review | null>(null);

  /** Хранит массив координат текущего выбранного маршрута */
  private _current_path_data = new BehaviorSubject<[[number, number]] | null>(null);

  /** Происходит ли в данный момент изменение данных */
  public is_loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private map_service: MapService,
    private notificationService: NzNotificationService,
    private layoutService: MainLayoutService,
    private userService: UsersService,
    private createFeatureGQL: CreateFeatureGQL,
    private updateFeatureGQL: UpdateFeatureGQL,
    private createEstimationGQL: CreateEstimationGQL,
    private updateEstimationGQL: UpdateEstimationGQL,
    private createCommentGQL: CreateCommentGQL,
    private updateCommentGQL: UpdateCommentGQL,
    private getReviewGQL: ReviewGQL,
    private createReviewGQL: CreateReviewGQL,
    private updateReviewGQL: UpdateReviewGQL
  ) {
    this.logger.status("Initialized");
    this.map_service.map_clicked$.pipe(
      withLatestFromFilter(this.layoutService.isNewReviewOpened$, (_, is_opened) => is_opened)
    ).subscribe((event) => {
      const features = this.map_service.mapboxMap?.queryRenderedFeatures(makeBox(event.point));
      console.log("Selected features", features);
      if (!features?.length) {
        this.notificationService.info(
          "Mapbox",
          "No features selected!"
        );
        return;
      }
      const f2 = sourceFilter(features, 'selected_road');
      if (f2.length) {
        this.removePathByMarker(f2[0])
        return;
      }


      const f1 = sourceLayersFilter(features, ["road"]);
      if (f1.length) {
        this.addFeatureToPath(targetLayerFilter(f1, map_map_priorities), event)
        return;
      }

      this.notificationService.info(
        "Mapbox",
        "No required (by source layer) features selected!"
      );
    });

    this.layoutService.isNewReviewOpened$.pipe(
      distinctUntilChanged(),
      filter(opened => opened)
    ).subscribe(async () => {
      if (!this.current_review_id) {
        await this.getOrCreateReview();
      }
    });

    this._current_path_data.subscribe((data) => {
      if (data) {
        this.map_service.setPathData(data, "Calculated road");
      } else {
        this.map_service.clearPathData("Calculated road");
      }
    });
  }

  private removePathByMarker(marker: mapboxgl.MapboxGeoJSONFeature) {
    this.logger.func('removePathByMarker')
    console.log(marker);
  }

  private addFeatureToPath(feature: mapboxgl.MapboxGeoJSONFeature, event: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
    if (!("coordinates" in feature.geometry)) {
      return;
    }
    const raw_coordinates = feature.geometry.coordinates as [[number, number]] | [[[number, number]]];
    const coordinates: [[number, number]] = typeof raw_coordinates[0][0] === "object" ?
      findClosestToPintPath(raw_coordinates as [[[number, number]]], [event.lngLat.lng, event.lngLat.lat]) :
      raw_coordinates as [[number, number]];

    console.log("Points coordinats", coordinates);
    this._current_path_data.next(
      this._current_path_data.value ?
        appendPathToPath(this._current_path_data.value, coordinates)
        : coordinates
    );
    const geojson = {
      "type": "FeatureCollection",
      "features": coordinates.map(coord => ({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": coord
        }
      }))
    };
    this.map_service.updateGeo(geojson, "selected_road");
  }

  /** Очистить выбранный путь */
  public clearPath() {
    this._current_path_data.next(null);
  }

  public async getOrCreateReview() {
    if (!this.userService.current_user$.value) {
      this.notificationService.error(
        "CreateReview",
        "No user id!"
      );

      return;
    }
    const possibleExistReview = await lastValueFrom(this.getReviewGQL.fetch({
      data: {
        authorId: this.userService.current_user$.value?.id,
        in_progress: true
      }
    }));
    if (possibleExistReview && possibleExistReview.data.review) {
      this.logger.info("Loaded exiting review");
      this._current_review.next(possibleExistReview.data.review as Review);
      return;
    }
    this.logger.info("Creating new review");
    this.createReviewGQL.mutate({
      data: {
        title: "Test"
      }
    }).subscribe(({ data, loading }) => {
      this._current_review.next(data?.createReview as Review);
      this.is_loading$.next(loading);
    });
  }

  public createOrUpdateFeature() { //TODO обернуть промисом?
    this.logger.func("CreateOrUpdateFeature");
    if (!this._current_review.value?.id) {
      this.notificationService.error(
        "CreateFeature",
        "No review id!"
      );
      return;
    }
    if (!this._current_path_data.value || !(this._current_path_data.value.length > 1)) {
      this.notificationService.error(
        "CreateFeature",
        "No path data or not enough data!"
      );
      return;
    }
    /** Если не существует feature -> создаем */
    if (!this.current_feature?.id) {
      this.createFeatureGQL.mutate({
        data: {
          geometry: this._current_path_data.value.map(point => geoJsonPointToDbPoint(point)),
          reviewId: this._current_review.value?.id
        }
      }).pipe(
        tap(result => this.is_loading$.next(result.loading)),
        filter(result => !result.loading)
      ).subscribe((response) => {
        if (response.errors) {
          this.notificationService.error(
            "CreateFeature",
            "Cannot create feature (server error)!"
          );

          return; //TODO return что-то (reject)
        }

        this.set_current_feature = response.data!.createFeature as Feature;
      });
    } else {
      /** Если существует -> обновляем */
      this.updateFeatureGQL.mutate({
        data: {
          featureId: this.current_feature.id,
          geometry: this._current_path_data as unknown as [number, number][]
        }
      }).pipe(
        tap(result => this.is_loading$.next(result.loading)),
        filter(result => !result.loading)
      ).subscribe((response) => {
        if (response.errors) {
          this.notificationService.error(
            "UpdateFeature",
            "Cannot update feature (server error)!"
          );

          return;
        }
      });
    }
  }

  public async createOrUpdateEstimation(data: IReviewEstimationModel) {
    this.logger.func("CreateOrUpdateEstimation");
    if (!this.current_review_id) {
      this.notificationService.error(
        "CreateOrUpdateEstimation",
        "No review id!"
      );
      return false;
    }

    /** Если не существует estimation -> создаем */
    if (!this.current_estimation?.id) {
      this.createEstimationGQL.mutate({
        data: {
          ...data,
          reviewId: this.current_review_id
        }
      }).pipe(
        tap(result => this.is_loading$.next(result.loading)),
        filter(result => !result.loading)
      ).subscribe((response) => {
        if (response.errors) {
          this.notificationService.error(
            "CreateEstimation",
            "Cannot create estimation (server error)!"
          );

          return false; //TODO return что-то (reject)
        }

        this.set_current_estimation = response.data!.createEstimation as Estimation;
        return true;
      });
    } else {
      this.updateEstimationGQL.mutate({
        data: {
          estimationId: this.current_estimation.id,
          ...data
        }
      }).pipe(
        tap(result => this.is_loading$.next(result.loading)),
        filter(result => !result.loading)
      ).subscribe((response) => {
        if (response.errors) {
          this.notificationService.error(
            "UpdateEstimation",
            "Cannot update estimation (server error)!"
          );

          return false; //TODO return что-то (reject)
        }

        this.set_current_estimation = response.data!.updateEstimation as Estimation;
        this.notificationService.success(
          "UpdateEstimation",
          "Estimation updated!"
        );
        this.set_current_estimation = response.data!.updateEstimation as Estimation;
        return true;
      });
    }

    return false;
  }

  public createOrUpdateComment(data: ICommentFormModel) {
    this.logger.func("CreateOrUpdateComment");
    if (!this._current_review.value?.id) {
      return;
    }
    if (!this.current_comment?.id) {
      this.createCommentGQL.mutate({
        data: {
          text: data.text,
          authorId: this.userService.current_user$.value?.id,
          reviewId: this._current_review.value?.id
        }
      }).pipe(
        tap(result => this.is_loading$.next(result.loading)),
        filter(result => !result.loading)
      ).subscribe((response) => {
        if (response.errors) {
          this.notificationService.error(
            "CreateComment",
            "Cannot create comment (server error)!"
          );

          return false; //TODO return что-то (reject)
        }

        this.set_current_comment = response.data!.createComment as CommentModel;
        return true;
      });
    } else {
      this.updateCommentGQL.mutate({
        data: {
          id: this.current_comment.id,
          ...data
        }
      }).pipe(
        tap(result => this.is_loading$.next(result.loading)),
        filter(result => !result.loading)
      ).subscribe((response) => {
        if (response.errors) {
          this.notificationService.error(
            "UpdateComment",
            "Cannot update comment (server error)!"
          );

          return false;
        }

        return true;
      });
    }
  }

  /** Проверяет заполненость всех полей review и отправляет запрос на обновление статуса review */
  public async submitReview() {
    if (!this.current_feature && !this.current_estimation && !this.current_comment) {
      this.notificationService.error(
        "SubmitReview",
        "Not all steps completed!"
      );
      return false;
    }

    const response = await lastValueFrom(
      this.updateReviewGQL.mutate({
        data: {
          reviewId: this.current_review_id!,
          in_progress: false
        }
      }).pipe(
        tap(result => this.is_loading$.next(result.loading)),
        filter(result => !result.loading)
      )
    );

    if (response.errors) {
      this.notificationService.error(
        "SubmitReview",
        "Cannot submit review (server error)!"
      );

      return false;
    }

    this.notificationService.success(
      "SubmitReview",
      "Review completed!"
    );

    this._current_review.next(null);
    this.clearPath()
    return true;
  }

  // ======================= GETTERS =======================
  public get current_path$() {
    return this._current_path_data;
  }

  public get current_path_length() {
    return this._current_path_data.value?.length ?? 0;
  }

  public get current_review_id() {
    return this._current_review.value?.id;
  }

  public get current_feature() {
    return this._current_review.value?.feature;
  }

  public get current_estimation() {
    return this._current_review.value?.estimation;
  }

  public get current_estimation_data() {
    return pick(["road_congestion", "road_quality", "travel_safety"])(this._current_review.value?.estimation);
  }

  public get current_comment() {
    return this._current_review.value?.comments ? this._current_review.value?.comments[0] : undefined; //TODO переделать
  }

  public get current_comment_data() {
    return pick(["text"])(this._current_review.value?.comments);
  }

  // ======================= SETTERS =======================
  public set set_current_feature(data: Feature) {
    if (this._current_review.value) {
      this._current_review.next({ ...this._current_review.value, feature: data });
    }
  }

  public set set_current_estimation(data: Estimation) {
    if (this._current_review.value) {
      this._current_review.next({ ...this._current_review.value, estimation: data });
    }
  }

  public set set_current_comment(data: CommentModel) {
    console.log(this._current_review.value);
    if (this._current_review.value) {
      console.log("Here");
      this._current_review.next({ ...this._current_review.value, comments: [data] });
    }
  }
}
