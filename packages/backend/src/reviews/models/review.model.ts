import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { Estimation } from './estimation.model';
import { Comment } from '../../comments/models/comment.model';
import { Feature } from './feature.model';

@ObjectType()
export class Review extends BaseModel {
  title: string;
  @Field({ nullable: true })
  feature: Feature;
  @Field({ nullable: true })
  estimation: Estimation;

  comments: Comment[];

  in_progress: boolean;
}
