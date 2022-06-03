import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  authorId: string | undefined;

  @Field({ nullable: true })
  reviewId: string;

  @Field(() => String)
  @IsNotEmpty()
  text: string;
}
