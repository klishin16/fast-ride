import { LngLatLike, MapboxGeoJSONFeature } from "mapbox-gl";
import { distanceBetweenPoints } from "./map.helpers";

/** A */
export const sourceLayersFilter = (in_features: Array<MapboxGeoJSONFeature>, layers: Array<string>): Array<MapboxGeoJSONFeature> => {
  return in_features.filter(feature => layers.includes(feature.sourceLayer))
}

export const sourceFilter = (in_features: Array<MapboxGeoJSONFeature>, source_name: string): Array<MapboxGeoJSONFeature> => {
  return in_features.filter(feature => feature.source === source_name)
}

export const targetLayersFilter = (in_features: Array<MapboxGeoJSONFeature>, layers: Array<string>): Array<MapboxGeoJSONFeature> => {
  return in_features.filter(feature => layers.includes(feature.layer.id))
}

export const targetLayerFilter = (in_features: Array<MapboxGeoJSONFeature>, priority_map: Map<string, number>): MapboxGeoJSONFeature => {
  if (in_features.length === 1) {
    return in_features[0]
  }

  return in_features.map(feature => ({"priority": priority_map.get(feature.layer.id)??0, "feature": feature}))
    .sort((a, b) => a.priority - b.priority)[0].feature
}

export const findClosestToPintPath = (in_paths: Array<[[number, number]]>, point: [number, number]): [[number, number]] => {
  return in_paths.map(in_path => ({
    path: in_path,
    min_distance: in_path.reduce<number>((min_d, current_point) => Math.min(distanceBetweenPoints(current_point, point), min_d), 1000)
  })).sort((a, b) => a.min_distance - b.min_distance)[0].path
}
