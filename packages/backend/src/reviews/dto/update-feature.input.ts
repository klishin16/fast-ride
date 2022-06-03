import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateFeatureInput {
  @Field()
  featureId: string;

  @Field(() => [[Number, Number]])
  geometry: [[number, number]];
}
