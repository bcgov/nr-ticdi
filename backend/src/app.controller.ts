import { Get, Controller } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Get('healthcheck')
  @Public()
  getHello(): string {
    return 'Hello Backend!';
  }
}
