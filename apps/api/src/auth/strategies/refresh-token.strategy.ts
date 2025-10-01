import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { AuthService } from '../auth.service'
import { JwtPayload } from '../types/auth-user.type'
import refreshConfig from '../config/refresh.config'

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'), //can have body also
      secretOrKey: refreshConfiguration.secret!, //jwt key from config
      ignoreExpiration: false,
      passReqToCallback: true, // allow validate to receive request as first arg
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    const userId = payload.sub
    // Extract refresh token from request body
    const refreshToken = req.body.refreshToken
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in request')
    }
    return await this.authService.validateRefreshToken(userId, refreshToken)
  }
}
