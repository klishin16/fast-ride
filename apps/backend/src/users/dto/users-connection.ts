import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { User } from '../models/user.model';

@ObjectType()
export class UsersConnection extends PaginatedResponse(User) {}
