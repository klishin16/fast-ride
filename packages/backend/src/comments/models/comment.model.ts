import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { User } from '../../users/models/user.model';
import { Review } from '../../reviews/models/review.model';
import { CommentLike } from './comment-like.model';

@ObjectType()
export class Comment extends BaseModel {
  @Field({ nullable: true })
  author: User;
  review: Review;
  @Field(() => String)
  text: string;
  @Field(() => [CommentLike])
  likes: CommentLike[];
}
