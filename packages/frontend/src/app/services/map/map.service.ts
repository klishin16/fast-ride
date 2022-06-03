import { ElementRef, Injectable } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { IMapInitializeOptions, map_map_priorities } from "./map.types";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Subject,
  take,
  withLatestFrom
} from "rxjs";
import { GeoJSONSource, GeoJSONSourceRaw, MapboxGeoJSONFeature, PointLike } from "mapbox-gl";
import { sourceLayersFilter, targetLayerFilter } from "./map-filters.helper";
import { LoggerService } from "../logger/logger.service";
import { gql } from "apollo-angular";
import { Logger } from "../logger/logger";
import { featuresToGeoJson } from "./map.helpers";


@Injectable({
  providedIn: "root"
})
export class MapService {
  private logger = new Logger(MapService.name);
  /** Define map style */
    // private mapTheme = "mapbox://styles/mapbox/dark-v8";
  private mapTheme = "mapbox://styles/mapbox/streets-v11";

  /** Широта */
  private latitude: number = 55.744537;

  /** Долгота */
  private longitude: number = 37.625224;

  /** Приближение */
  private zoom: number = 15;

  /** Объект карты */
  mapboxMap: mapboxgl.Map | undefined;

  /** Необходимо вызвать для reshape карты */
  public should_resize_map$ = new Subject<void>();

  public map_clicked$: Subject<mapboxgl.MapMouseEvent & mapboxgl.EventData> = new Subject();

  public map_initialized$ = new BehaviorSubject<boolean>(false)

  private geoLocate: mapboxgl.GeolocateControl

  /** Map actions */
  map_moveend$ = new Subject<void>();
  map_zoomend$ = new Subject<void>();

  constructor(private notificationService: NzNotificationService) {
    /** Иициализация класса геолокации */
    this.geoLocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    })
  }


  private setLocationToCurrentGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.mapboxMap!.flyTo({
        //   center: [this.longitude, this.latitude],
        //   zoom: this.zoom
        // })
      });
    }
  }

  public initializeMap(initOptions: IMapInitializeOptions) {
    this.setLocationToCurrentGeolocation();

    this.buildMap(initOptions.mapboxContainer);

    setTimeout(() => {
      this.mapboxMap?.resize();
    }, 1000);

    this.map_initialized$.pipe(
      filter(value => value),
      take(1)
    ).subscribe(() => {
      this.should_resize_map$.subscribe(() => {
        this.logger.info("Resizing map");
        this.mapboxMap?.resize();
      });

      this.mapboxMap?.on("moveend", () => this.map_moveend$.next());
      this.mapboxMap?.on("zoomstart", () => this.map_zoomend$.next());
    })
  }


  private buildMap(mapboxContainer: ElementRef | undefined) {
    if (!mapboxContainer) {
      this.notificationService.error(
        "MapBox Error",
        "No container element!"
      );
      return;
    }
    this.mapboxMap = new mapboxgl.Map({
      container: mapboxContainer.nativeElement,
      style: this.mapTheme,
      zoom: this.zoom,
      center: [this.longitude, this.latitude]
    });


    /// Add map controls
    this.mapboxMap.addControl(new mapboxgl.NavigationControl());
    /** Show my location */
    this.mapboxMap.addControl(
      this.geoLocate
    );
    this.geoLocate.on('geolocate', (e) => {
      console.log("Set zoom");
      this.mapboxMap?.setZoom(10)
    })


    /** Calls on map click */
    this.mapboxMap.on("click", (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      console.log("Picked coordinates:", coordinates);
      this.map_clicked$.next(event);
    });

    this.mapboxMap.on("load", (event) => {
      this.logger.status('Map initialized')
      this.map_initialized$.next(true)
    });
  }

  public setSourceData(data: any, layer_or_source_name: string) {
    // @ts-ignore
    this.mapboxMap?.getSource(layer_or_source_name).setData(data);
  }

  public clearSourceData(layer_or_source_name: string) {
    this.logger.func('clearSourceData')
    // @ts-ignore
    this.mapboxMap?.getSource(layer_or_source_name).setData(featuresToGeoJson([]));
  }

  public checkIfLayerExist(layer_or_source_name: string): boolean {
    this.logger.func("Check If Layer Exist");
    return !!this.mapboxMap?.getLayer(layer_or_source_name);
  }

  public createSourceWithLayer(layer_or_source_name: string, layer_type: "circle" | "line" = "circle", source_geoJson_data: any, layout?: any, paint?: any) {
    this.logger.func("Create Source With Layer");

    if (this.mapboxMap?.getLayer(layer_or_source_name)) {
      this.mapboxMap?.removeLayer(layer_or_source_name);
      this.mapboxMap?.removeSource(layer_or_source_name);
    }

    this.mapboxMap?.addSource(layer_or_source_name, {
      "type": "geojson",
      "data": source_geoJson_data
    });

    this.mapboxMap?.addLayer({
        "id": layer_or_source_name,
        "type": layer_type,
        "source": layer_or_source_name,
        ...(layout && {
          "layout": layout
        }),
        ...(paint && {
          "paint": paint
        })
      }
    );
  }

  // Устаревший
  public updateGeo(geoJson: any, name: string, layer_type: "circle" | "line" = "circle") {
    if (this.mapboxMap?.getLayer(name)) {
      this.mapboxMap?.removeLayer(name);
      this.mapboxMap?.removeSource(name);
    }

    this.mapboxMap?.addSource(name, {
      "type": "geojson",
      "data": geoJson
    });
    if (layer_type === "circle") {
      this.mapboxMap?.addLayer({
        "id": name,
        "type": layer_type,
        "source": name,
        "paint": {
          "circle-radius": 10,
          "circle-color": "#F84C4C"
        }
      });
    } else {
      this.mapboxMap?.addLayer({
        "id": name,
        "type": layer_type,
        "source": name,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-width": 8
        }
      });
    }
  }

  public setPathData(data: [[number, number]], road_name: string) {
    const t = {
      type: "geojson",
      data: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": data
            }
          }
        ]
      }
    };

    if (!this.mapboxMap?.getLayer(road_name)) {
      if (!this.mapboxMap) {
        this.logger.error("setPathData -> no map");
        return;
      }
      // @ts-ignore
      this.mapboxMap.addSource(road_name, t);
      this.addPathLayer(road_name);
    } else {
      // @ts-ignore
      this.mapboxMap?.getSource(road_name).setData(t.data);
    }
  }

  private addPathLayer(path_id: string) {
    this.logger.func("(Deprecated) Add Path Layer");
    this.mapboxMap?.addLayer({
      "id": path_id,
      "type": "line",
      "source": path_id,
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "yellow",
        "line-width": 8
      }
    });
  }

  clearPathData(road_name: string) {
    const t = {
      type: "geojson",
      data: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": []
            }
          }
        ]
      }
    };
    // @ts-ignore
    this.mapboxMap?.getSource(road_name).setData(t.data);
  }

  public setFeaturesColors(data: Array<{ feature_id: number, color_level: number }>, layer_name: string) {
    this.logger.func("Set Features Colors");
    console.log(this.mapboxMap?.getSource(layer_name));
    data.forEach((d) => {
      this.mapboxMap?.setFeatureState({
        source: layer_name,
        id: d.feature_id
      }, {
        usability_level: d.color_level
      });
    });
  }

  public getBounds() {
    return this.mapboxMap?.getBounds();
  }
}
