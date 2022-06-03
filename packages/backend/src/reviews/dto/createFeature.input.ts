import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateFeatureInput {
  @Field()
  reviewId: string;

  @Field(() => [[Number, Number]])
  geometry: [[number, number]];
}
