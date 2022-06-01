import { Injectable } from "@angular/core";
import { Logger } from "../logger/logger";
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  take, tap,
  withLatestFrom
} from "rxjs";
import { Exact, Feature, FeaturesGQL, FeaturesQuery, Review } from "../../graphql/generated/schema";
import { MapService } from "./map.service";
import { featuresToGeoJson, generateFeatureColor, mapBoundsToDbBounds } from "./map.helpers";
import { withLatestFromFilter } from "./map.types";
import { QueryRef } from "apollo-angular";

@Injectable({
  providedIn: "root"
})
export class RoadsViewService {
  private logger = new Logger(RoadsViewService.name);

  static map_layer_name = "roads-review";

  public is_roads_map_shown$ = new BehaviorSubject(false);

  private _features_data = new BehaviorSubject<Array<Feature> | null>(null);

  public is_roads_loading$ = new BehaviorSubject<boolean>(false);

  constructor(private featuresGQL: FeaturesGQL, private mapService: MapService) {
    this.logger.status("Initialized");

    this.is_roads_map_shown$.pipe(
      filter(shown => shown),
      take(1)
    ).subscribe(() => {
      this.loadRoadsAndSubscribe();
    });

    this._features_data.pipe(
      combineLatestWith(this.is_roads_map_shown$)
    ).subscribe(([features_data, is_shown]) => {
      if (is_shown && features_data) {
        const geoJson = featuresToGeoJson(features_data);

        /** Установка данных */
        if (!this.mapService.checkIfLayerExist(RoadsViewService.map_layer_name)) {
          this.mapService.createSourceWithLayer(
            RoadsViewService.map_layer_name,
            "line",
            geoJson,
            {
              "line-join": "round",
              "line-cap": "round"
            },
            {
              "line-color": [
                "case",
                ["==", ["feature-state", "usability_level"], 1], "#FF3D00",
                ["==", ["feature-state", "usability_level"], 2], "#FFC400",
                ["==", ["feature-state", "usability_level"], 3], "#76FF03",
                "blue"
              ],
              "line-width": 9
            }
          );
        } else {
          this.mapService.setSourceData(geoJson, RoadsViewService.map_layer_name);
        }

        /** Установка цвета */
        const feature_colors = (features_data as Array<Feature>).map((feature) => {
          return {
            feature_id: feature.mapId,
            color_level: generateFeatureColor(feature.review as Review)
          };
        });
        this.mapService.setFeaturesColors(feature_colors, RoadsViewService.map_layer_name);
      }
      else {
        if (this.mapService.checkIfLayerExist(RoadsViewService.map_layer_name)) {
          this.mapService.clearSourceData(RoadsViewService.map_layer_name)
        }
      }
    });

    merge(this.mapService.map_moveend$, this.mapService.map_zoomend$).pipe(
      debounceTime(1000),
      map(() => this.mapService.getBounds()),
      distinctUntilChanged((prev, current) => (!!prev && !!current) ? prev.toArray() == current.toArray() : false),
      withLatestFromFilter(this.is_roads_map_shown$, (_, is_shown) => is_shown)
    ).subscribe((d) => {
      if (d) {
        this.loadRoads(d);
      }
    });
  }

  public toggleRoads() {
    this.logger.func("Toggle roads");
    this.is_roads_map_shown$.next(!this.is_roads_map_shown$.value);
  }

  public loadRoads(bounds: mapboxgl.LngLatBounds) {
    this.logger.func("Load roads");
    this.is_roads_loading$.next(true)
    this.featuresGQL.fetch({
      data: {
        in_progress: false
      },
      bounds: {
        ...mapBoundsToDbBounds(bounds)
      }
    }).pipe(
      tap(result => setTimeout(() => this.is_roads_loading$.next(result.loading), 250)),
      filter(result => !result.loading)
    ).subscribe((response) => {
      if (response.data.features) {
        this._features_data.next(response.data.features as Array<Feature>);
      }
    })
  }

  public loadRoadsAndSubscribe() {
    this.logger.func("First load roads (and subscribe)");
    this.is_roads_loading$.next(true)
    this.featuresGQL.watch({
      data: {
        in_progress: false
      },
      bounds: {
        ...mapBoundsToDbBounds(this.mapService.getBounds()!)
      }
    }).valueChanges.pipe(
      tap(result => setTimeout(() => this.is_roads_loading$.next(result.loading), 250)),
      filter(result => !result.loading)
    ).subscribe((response) => {
      if (response.data.features) {
        this._features_data.next(response.data.features as Array<Feature>);
      }
    });
  }

  public get features_data$() {
    return this._features_data
  }
}
