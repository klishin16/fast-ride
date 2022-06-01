import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput {
  @Field()
  reviewId: string;

  @Field()
  in_progress: boolean;
}
