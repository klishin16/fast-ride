import { Module } from '@nestjs/common';
import { CommentsResolver } from './comments.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommentsResolver],
})
export class CommentsModule {}
