import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { Review } from './review.model';

@ObjectType()
export class Estimation extends BaseModel {
  review: Review;
  road_quality: number;
  travel_safety: number;
  road_congestion: number;
}
