import { ElementRef } from "@angular/core";
import { filter, map, Observable, ObservedValueOf, pipe, UnaryFunction, withLatestFrom } from "rxjs";

export interface IMapInitializeOptions {
  mapboxContainer: ElementRef | undefined;
}

export const map_map_priorities: Map<string, number> = new Map([
  ["road-primary", 10],
  ["road-secondary-tertiary", 9],
  ["road-street", 7],
  ["road-minor", 1]
])

export interface IReviewFeatureModel {
  geometry: [[number, number]]
}

export interface IReviewEstimationModel {
  road_quality: number,
  travel_safety: number,
  road_congestion: number
}

export interface ICommentFormModel {
  text: string
}

export function withLatestFromFilter<T, O2 extends Observable<any>>(
  source: O2,
  filter_func: (v1: T, v2: ObservedValueOf<O2>) => boolean
): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(
    withLatestFrom(source),
    filter(([v1, v2]) => filter_func(v1, v2)),
    map(([v1]) => v1)
  );
}
