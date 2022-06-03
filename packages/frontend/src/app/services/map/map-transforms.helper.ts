import { Point, PointLike } from "mapbox-gl";

export function makeBox(point: Point): [PointLike, PointLike] {
  return [
    [point.x - 1, point.y - 1],
    [point.x + 1, point.y + 1]
  ];
}

