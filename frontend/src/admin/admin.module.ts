import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { AdminGuard } from "./admin.guard";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [HttpModule],
  providers: [AdminGuard, AdminService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
