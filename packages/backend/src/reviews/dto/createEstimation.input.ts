import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateEstimationInput {
  @Field()
  reviewId: string;

  @Field()
  road_quality: number;

  @Field()
  travel_safety: number;

  @Field()
  road_congestion: number;
}
