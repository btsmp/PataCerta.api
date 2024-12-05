import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InterestsModule } from './modules/interests/interests.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { EventsModule } from './modules/events/events.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';
import { PrismaService } from './shared/config/prisma';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    AuthModule,
    JwtModule,
    PetsModule,
    InterestsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
