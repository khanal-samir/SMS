import { BadRequestException, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { envSchema } from 'src/config/env.config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { APP_GUARD } from '@nestjs/core/constants'
import { RolesGuard } from 'src/auth/guards/roles/roles.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard.ts/jwt-auth.guard'
import { SeedModule } from 'src/seed/seed.module'
import { SemesterModule } from 'src/semester/semester.module'
import { SubjectModule } from 'src/subject/subject.module'
import { BatchModule } from 'src/batch/batch.module'
import { AssignmentModule } from 'src/assignment/assignment.module'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    SeedModule,
    SemesterModule,
    SubjectModule,
    BatchModule,
    AssignmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = envSchema.safeParse(config)
        if (!parsed.success) {
          throw new BadRequestException('Invalid environment variables', {
            cause: parsed.error.flatten().fieldErrors,
          })
        }
        return parsed.data
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD, //global guard
      useClass: JwtAuthGuard, //@UseGuard(JwtAuthGuard)
    },
    {
      provide: APP_GUARD, //global guard
      useClass: RolesGuard, //@UseGuard(Roles)
    },
  ],
})
export class AppModule {}
