import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { User } from '../../users/models/user.model';
import { Comment } from './comment.model';

@ObjectType()
export class CommentLike extends BaseModel {
  author: User;
  comment: Comment;
}
