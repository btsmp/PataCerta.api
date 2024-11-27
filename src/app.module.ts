import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';
import { PrismaService } from './shared/config/prisma';
import { JwtModule } from '@nestjs/jwt';
import { InterestsModule } from './modules/interests/interests.module';

@Module({
  imports: [UserModule, AuthModule, JwtModule, PetsModule, InterestsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
