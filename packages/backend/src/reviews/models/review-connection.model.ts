import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { Review } from './review.model';

@ObjectType()
export class ReviewConnection extends PaginatedResponse(Review) {}
