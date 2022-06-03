import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ReviewConnection } from './models/review-connection.model';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Review } from './models/review.model';
import { CreateReviewInput } from './dto/createReview.input';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from '../prisma/prisma.service';
import { Feature } from './models/feature.model';
import { CreateFeatureInput } from './dto/createFeature.input';
import { ReviewsService } from './reviews.service';
import { Estimation } from './models/estimation.model';
import { CreateEstimationInput } from './dto/createEstimation.input';
import { GetReviewInput } from './dto/getReview.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { UpdateReviewInput } from './dto/update-review.input';
import { GeometryBoundArgs } from './dto/geometry-bound.args';
import { FeatureConnection } from './models/feature-connection.model';
import { UpdateEstimationInput } from './dto/update-estimation.input';
import { UpdateFeatureInput } from './dto/update-feature.input';
import { GetFeaturesInput } from './dto/get-features.input';

const pubSub = new PubSub();

@Resolver()
export class ReviewsResolver {
  constructor(
    private prisma: PrismaService,
    private reviewsService: ReviewsService
  ) {}

  @Subscription(() => Review)
  reviewCreated() {
    return pubSub.asyncIterator('reviewCreated');
  }

  @Mutation(() => Review, { description: 'Create new review' })
  @UseGuards(GqlAuthGuard)
  public async createReview(
    @Args('data') data: CreateReviewInput,
    @UserEntity() user: User
  ) {
    const newReview = await this.reviewsService.createReview(data, user);
    await pubSub.publish('reviewCreated', { reviewCreated: newReview });
    return newReview;
  }

  @Query(() => ReviewConnection)
  public async reviewsWithPagination(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true }) query: string
  ) {
    return await findManyCursorConnection(
      (args) =>
        this.prisma.review.findMany({
          where: {
            title: { contains: query || '' },
          },
          ...args,
        }),
      () =>
        this.prisma.review.count({
          where: {
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
  }

  @Query(() => [Feature])
  public async features(
    @Args({ name: 'bounds', type: () => GeometryBoundArgs })
    geometryBoundArgs: GeometryBoundArgs,
    @Args('data') data: GetFeaturesInput
  ) {
    return this.reviewsService.getFeatures(geometryBoundArgs, data);
  }

  @Query(() => FeatureConnection)
  public async featuresWithPagination(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true }) query: string
  ) {
    return await findManyCursorConnection(
      (args) =>
        this.prisma.feature.findMany({
          where: {},
          ...args,
        }),
      () =>
        this.prisma.feature.count({
          where: {},
        }),
      { first, last, before, after }
    );
  }

  /** Get single review */
  @Query(() => Review, { nullable: true })
  public async review(@Args('data') data: GetReviewInput) {
    return await this.prisma.review.findFirst({
      where: {
        ...data,
      },
      include: {
        feature: true,
        estimation: true,
        comments: true,
      },
    });
  }

  @Query(() => [Review])
  public async reviews(
    @Args({ name: 'userId', type: () => String, nullable: true }) userId: string
  ) {
    return this.prisma.review.findMany({
      where: {
        ...(userId && {
          authorId: userId,
        }),
      },
      include: {
        feature: true,
        estimation: true,
      },
    });
  }

  /** Update review progress */
  @Mutation(() => Review)
  public async updateReview(@Args('data') data: UpdateReviewInput) {
    return this.reviewsService.updateReview(data);
  }

  // ================================= FEATURE ===========================
  @Mutation(() => Feature)
  public async createFeature(@Args('data') data: CreateFeatureInput) {
    return this.reviewsService.createFeature(data);
  }

  /** Update feature */
  @Mutation(() => Feature)
  public async updateFeature(@Args('data') data: UpdateFeatureInput) {
    const { featureId, ...featureData } = data;
    return this.reviewsService.updateFeature(featureId, featureData);
  }

  // ================================= ESTIMATION ===========================
  @Mutation(() => Estimation)
  public async createEstimation(@Args('data') data: CreateEstimationInput) {
    return this.reviewsService.createEstimation(data);
  }

  /** Update estimation */
  @Mutation(() => Estimation)
  public async updateEstimation(@Args('data') data: UpdateEstimationInput) {
    const { estimationId, ...estimationData } = data;
    return this.reviewsService.updateEstimation(estimationId, estimationData);
  }

  @Query(() => [Estimation])
  public async estimations() {
    return this.prisma.estimation.findMany();
  }
}
