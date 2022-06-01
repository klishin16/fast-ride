import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  featureId: string | null;

  @Field({ nullable: true })
  estimationId: string | null;

  @Field(() => [String], { nullable: true })
  commentsId: string[] | null;
}
