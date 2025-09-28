import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '../auth.service'
import jwtConfig from '../config/jwt.config'
import { JwtPayload } from '../types/auth-user.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret!, //jwt key from config
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub
    return await this.authService.validateJwtUser(userId)
  }
}
