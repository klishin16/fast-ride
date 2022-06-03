import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetFeaturesInput {
  @Field({ nullable: true })
  authorId?: string;

  @Field({ nullable: true })
  in_progress?: boolean;
}
