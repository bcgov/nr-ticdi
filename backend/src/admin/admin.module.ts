import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [HttpModule, AuthenticationModule],
  providers: [AdminGuard, AdminService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
