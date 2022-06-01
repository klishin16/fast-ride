import { PrismaService } from './prisma.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}
