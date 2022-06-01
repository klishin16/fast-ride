import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { Review } from './review.model';

@ObjectType()
export class Feature extends BaseModel {
  @Field(() => Review, { nullable: true })
  review: Review;
  topLeftLng: number;
  topLeftLat: number;
  bottomRightLnt: number;
  bottomRightLat: number;
  @Field(() => [[Number, Number]])
  geometry: [[number, number]];
  mapId: number;
}
