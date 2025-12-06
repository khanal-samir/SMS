import { Controller, Get } from '@nestjs/common'
import * as schemas from '@repo/schemas'
import { Public } from '../auth/decorators/public.decorator'
@Controller()
export class AppController {
  @Public()
  @Get('health')
  getHello(): Promise<schemas.ApiResponse<null>> {
    return Promise.resolve({
      statusCode: 200,
      message: 'Hello World',
      data: null,
    })
  }
}
