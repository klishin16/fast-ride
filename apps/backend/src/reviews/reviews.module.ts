import { Module } from '@nestjs/common';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReviewsResolver, ReviewsService],
})
export class ReviewsModule {}
