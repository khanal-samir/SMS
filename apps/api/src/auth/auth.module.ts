import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import jwtConfig from './config/jwt.config'
import refreshConfig from './config/refresh.config'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshStrategy } from './strategies/refresh-token.strategy'
import googleOauthConfig from './config/google-oauth.config'
import { GoogleStrategy } from './strategies/google-oauth.strategy'
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard.ts/jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core/constants'
import { RolesGuard } from './guards/roles/roles.guard'
import { MailModule } from 'src/common/mail/mail.module'

@Module({
  imports: [
    UserModule,
    MailModule,
    //jwt service instance is created used to sign/verify in service
    JwtModule.registerAsync(jwtConfig.asProvider()), // access token is default here so no injection but for refresh token injection is needed
    ConfigModule.forFeature(jwtConfig), //optional
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD, //global guard
      useClass: JwtAuthGuard, //@UseGuard(JwtAuthGuard)
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, //@UseGuard(Roles)
    },
  ],
})
export class AuthModule {}
