import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TenantAddr } from "./entities/tenantAddr.entity";
import { TenantAddrService } from "./tenantAddr.service";

@Module({
  imports: [TypeOrmModule.forFeature([TenantAddr])],
  providers: [TenantAddrService],
  exports: [TenantAddrService],
})
export class TenantAddrModule {}
