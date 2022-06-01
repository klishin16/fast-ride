import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetReviewInput {
  @Field()
  authorId: string;

  @Field()
  in_progress: boolean;
}
