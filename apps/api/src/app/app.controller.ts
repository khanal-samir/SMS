import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/auth/decorators/public.decorator'
import * as schemas from '@repo/schemas'
@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): Promise<schemas.ApiResponse<null>> {
    return Promise.resolve({
      statusCode: 200,
      message: 'Hello World',
      data: null,
    })
  }
}
