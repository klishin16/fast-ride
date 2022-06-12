import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { UsersConnection } from './dto/users-connection';
import {RolesGuard} from "../auth/roles.guard";
import {Roles} from "../auth/roles.decorator";

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @UseGuards(GqlAuthGuard)
  @Roles('ADMIN')
  @Mutation(() => User)
  async removeUser(@Args('user_id') user_id: string) {
    return this.prisma.user.delete(
      {
        where: {
          id: user_id
        }
      }
    )
  }

  @ResolveField('posts')
  posts(@Parent() author: User) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  }

  @Query(() => UsersConnection)
  public async usersWithPagination(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true }) query: string
  ) {
    return await findManyCursorConnection(
      (args) =>
        this.prisma.user.findMany({
          where: {
            email: query,
          },
          ...args,
        }),
      () =>
        this.prisma.user.count({
          where: {
            email: query,
          },
        }),
      { first, last, before, after }
    );
  }
}
