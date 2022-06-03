import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field({ nullable: true })
  authorId: string | undefined;

  @Field({ nullable: true })
  reviewId: string;

  @Field(() => String)
  @IsNotEmpty()
  text: string;
}
