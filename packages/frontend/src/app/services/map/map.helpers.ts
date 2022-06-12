import { Feature, Review } from "../../graphql/generated/schema";
import mapboxgl from "mapbox-gl";

export const distanceBetweenPoints = (a: [number, number], b: [number, number]): number => {
  return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2))
}

export const featuresToGeoJson = (features_data: Array<Feature>) => {
  return {
    "type": "FeatureCollection",
    "features": features_data.map((feature_data) => {
      return {
        type: "Feature",
        id: feature_data.mapId,
        properties: {
        },
        geometry: {
          "type": "LineString",
          "coordinates": feature_data.geometry.map(p => dbPointToGeoJsonPoint(p as [number, number]))
        }
      };
    })
  };
}

const mapNumberToDbNumber = (m_n: number): number => m_n / 1000000
const dbNumberToMapNumber = (d_n: number): number => Math.round(d_n * 1000000)

export const dbPointToGeoJsonPoint = (db_point: [number, number]): [number, number] => {
  return db_point.map((n) => mapNumberToDbNumber(n)) as [number, number]
}

export const geoJsonPointToDbPoint = (geo_point: [number, number]): [number, number] => {
  return geo_point.map(c => dbNumberToMapNumber(c)) as [number, number]
}

export const generateFeatureColor = (review: Review) => {
  if (review.estimation) {
    return Math.round((review.estimation.road_quality + review.estimation.road_congestion + review.estimation.travel_safety) / 100)
  } else {
    return -1
  }
}

export const appendPathToPath = (origin_path: [[number, number]], path_to_append: [[number, number]]): [[number, number]] => {
  const headPoint = path_to_append[0]
  const tailPoint = path_to_append[path_to_append.length - 1]

  let min_distance = 1000000
  let min_distance_point_index = 0
  const head_to_head = distanceBetweenPoints(origin_path[0], headPoint)
  const head_to_tail = distanceBetweenPoints(origin_path[0], tailPoint)
  const tail_to_head = distanceBetweenPoints(origin_path[origin_path.length - 1], headPoint)
  const tail_to_tail = distanceBetweenPoints(origin_path[origin_path.length - 1], tailPoint)
  if (head_to_head < min_distance) {
    min_distance = head_to_head
    min_distance_point_index = 0
  }
  if (head_to_tail < min_distance) {
    min_distance = head_to_tail
    min_distance_point_index = origin_path.length - 1
  }
  if (tail_to_head < min_distance) {
    min_distance = tail_to_head
    min_distance_point_index = 0
  }
  if (tail_to_tail < min_distance) {
    min_distance_point_index = origin_path.length - 1
  }

  return (min_distance_point_index === 0 ? origin_path.concat(path_to_append) : path_to_append.concat(origin_path)) as [[number, number]];
}

export const mapBoundsToDbBounds = (map_bounds: mapboxgl.LngLatBounds) => {
  return {
    topLeftLng: dbNumberToMapNumber(map_bounds!.getNorthWest().lng),
    topLeftLat: dbNumberToMapNumber(map_bounds!.getNorthWest().lat),
    bottomRightLnt: dbNumberToMapNumber(map_bounds!.getSouthEast().lng),
    bottomRightLat: dbNumberToMapNumber(map_bounds!.getSouthEast().lat)
  }
}
