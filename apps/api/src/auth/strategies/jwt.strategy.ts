import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { AuthService } from '../auth.service'
import jwtConfig from '../config/jwt.config'
import { JwtPayload } from '@repo/schemas'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //default name is 'jwt'
  constructor(
    @Inject(jwtConfig.KEY) // DI injection token
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Fallback for API clients
      ]),
      secretOrKey: jwtConfiguration.secret!, //jwt key from config
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub
    return await this.authService.validateJwtUser(userId)
  }
}
