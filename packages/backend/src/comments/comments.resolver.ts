import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { CommentConnection } from './models/comment-connection.model';
import { Comment } from './models/comment.model';
import { CreateCommentInput } from './dto/create-comment.input';
import { GraphQLError } from 'graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { UpdateCommentInput } from './dto/update-comment.input';

@Resolver()
export class CommentsResolver {
  private readonly logger = new Logger(CommentsResolver.name);

  constructor(private prisma: PrismaService) {}

  @Mutation(() => Comment)
  public createComment(@Args('data') in_data: CreateCommentInput) {
    this.logger.log('Create comment');
    try {
      return this.prisma.comment.create({
        data: {
          text: in_data.text,
          ...(in_data.authorId && {
            author: {
              connect: {
                id: in_data.authorId,
              },
            },
          }),
          ...(in_data.reviewId && {
            review: {
              connect: {
                id: in_data.reviewId,
              },
            },
          }),
        },
        include: {
          likes: true,
          author: true,
        },
      });
    } catch (e) {
      return new GraphQLError('Cannot create comment');
    }
    // await pubSub.publish('reviewCreated', { reviewCreated: newReview });
  }

  @Mutation(() => Comment)
  public updateComment(@Args('data') update_data: UpdateCommentInput) {
    this.logger.log('Update comment');
    try {
      return this.prisma.comment.update({
        where: {
          id: update_data.id,
        },
        data: {
          ...(update_data.text && {
            text: update_data.text,
          }),
          ...(update_data.authorId && {
            author: {
              connect: {
                id: update_data.authorId,
              },
            },
          }),
          ...(update_data.reviewId && {
            review: {
              connect: {
                id: update_data.authorId,
              },
            },
          }),
        },
      });
    } catch (e) {
      return new GraphQLError('Cannot update comment');
    }
  }

  @Query(() => CommentConnection)
  public async comments(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true }) query: string,
    @Args({ name: 'reviewId', type: () => String, nullable: true })
    reqReviewId?: string
  ) {
    return await findManyCursorConnection(
      (args) =>
        this.prisma.comment.findMany({
          ...args,
          where: {
            ...(reqReviewId && {
              reviewId: reqReviewId,
            }),
          },
          include: {
            author: true,
            likes: true,
          },
        }),
      () => this.prisma.comment.count(),
      { first, last, before, after }
    );
  }
}
