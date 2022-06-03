import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeatureInput } from './dto/createFeature.input';
import { CreateReviewInput } from './dto/createReview.input';
import { CreateEstimationInput } from './dto/createEstimation.input';
import { User } from '../users/models/user.model';
import { UpdateReviewInput } from './dto/update-review.input';
import { GeometryBoundArgs } from './dto/geometry-bound.args';
import { UpdateEstimationInput } from './dto/update-estimation.input';
import { UpdateFeatureInput } from './dto/update-feature.input';
import { GetFeaturesInput } from "./dto/get-features.input";

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private prisma: PrismaService) {}

  public async createFeature(data: CreateFeatureInput) {
    this.logger.log('Create Feature');
    return await this.prisma.feature.create({
      data: {
        review: {
          connect: {
            id: data.reviewId,
          },
        },
        ...this.calculateBound(data.geometry),
        geometry: data.geometry,
      },
    });
  }

  public async createReview(data: CreateReviewInput, user: User) {
    this.logger.log('createReview');
    return this.prisma.review.create({
      data: {
        title: data.title,

        ...(data.featureId && {
          feature: {
            connect: {
              id: data.featureId,
            },
          },
        }),

        ...(data.estimationId && {
          estimation: {
            connect: {
              id: data.estimationId,
            },
          },
        }),

        ...(data.commentsId && {
          comments: {
            connect: data.commentsId?.map((id) => ({ id })),
          },
        }),

        authorId: user.id,
      },
    });
  }

  public async updateReview(data: UpdateReviewInput) {
    this.logger.log('Update Review');
    const updateResp = await this.prisma.review.update({
      where: {
        id: data.reviewId,
      },
      data: {
        in_progress: data.in_progress,
      },
    });

    return updateResp;
  }

  public async createEstimation(data: CreateEstimationInput) {
    this.logger.log('createEstimation');
    return await this.prisma.estimation.create({
      data: {
        review: {
          connect: {
            id: data.reviewId,
          },
        },
        road_quality: data.road_quality,
        travel_safety: data.travel_safety,
        road_congestion: data.road_congestion,
      },
    });
  }

  private calculateBound(geometry: [[number, number]]): IGeometryBound {
    const accum: IGeometryBound = {
      topLeftLng: geometry[0][0],
      topLeftLat: geometry[0][1],
      bottomRightLat: geometry[0][0],
      bottomRightLnt: geometry[0][1],
    };

    return geometry.reduce<IGeometryBound>((gBound, point) => {
      return <IGeometryBound>{
        topLeftLng: point[0] > gBound.topLeftLng ? point[0] : gBound.topLeftLng,
        topLeftLat: point[1] > gBound.topLeftLat ? point[0] : gBound.topLeftLat,
        bottomRightLnt:
          point[0] < gBound.bottomRightLnt ? point[0] : gBound.bottomRightLnt,
        bottomRightLat:
          point[1] > gBound.bottomRightLat ? point[1] : gBound.bottomRightLat,
      };
    }, accum);
  }

  public async getFeatures(
    geometryBoundArgs: GeometryBoundArgs,
    data: GetFeaturesInput
  ) {
    this.logger.log('Get Features');
    const result = await this.prisma.feature.findMany({
      where: {
        topLeftLng: {
          gte: geometryBoundArgs.topLeftLng,
        },
        topLeftLat: {
          lte: geometryBoundArgs.topLeftLat,
        },
        bottomRightLnt: {
          lte: geometryBoundArgs.bottomRightLnt,
        },
        bottomRightLat: {
          gte: geometryBoundArgs.bottomRightLat,
        },
      },
      include: {
        review: {
          include: {
            estimation: {},
          },
        },
      },
    });

    return result;
  }

  public async updateEstimation(
    estimation_id: string,
    data: Omit<UpdateEstimationInput, 'estimationId'>
  ) {
    this.logger.log('updateEstimation');
    return await this.prisma.estimation.update({
      where: {
        id: estimation_id,
      },
      data: data,
    });
  }

  public async updateFeature(
    featureId: string,
    featureData: Pick<UpdateFeatureInput, 'geometry'>
  ) {
    this.logger.log('updateFeature');
    return await this.prisma.feature.update({
      where: {
        id: featureId,
      },
      data: featureData,
    });
  }
}

interface IGeometryBound {
  topLeftLng: number;
  topLeftLat: number;
  bottomRightLat: number;
  bottomRightLnt: number;
}
