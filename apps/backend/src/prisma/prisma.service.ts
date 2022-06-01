import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {ConfigService} from "@nestjs/config";
import {IConfig} from "../../config/config.interface";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: `postgresql://${configService.get('database.user')}:${configService.get('database.password')}@${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.schema')}?schema=public`
        }
      },
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'error', emit: 'event' },
      ],
    });
    console.info("Prisma connection url:", `postgresql://${configService.get('database.user')}:${configService.get('database.password')}@${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.schema')}?schema=public`)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('warn', (e) => {
      // this.logger.warn(e);
      this.logger.warn(e);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('info', (e) => {
      // this.logger.debug(e);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.logger.debug(e.message);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('error', (e) => {
      // this.logger.error(e);
      this.logger.error(e);
    });

    this.$use(async (params, next) => {
      const before = Date.now();

      const result = await next(params);

      const after = Date.now();

      this.logger.debug(
        `Prisma Query ${params.model}.${params.action} took ${after - before}ms`
      );

      return result;
    });
  }
}
