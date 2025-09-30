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

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()), // access token is default here so no injection but for refresh token injection is needed
    ConfigModule.forFeature(jwtConfig), //makes it injectable in services
    ConfigModule.forFeature(refreshConfig), // register refresh token config so it can be injected
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
