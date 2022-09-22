import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TenantAddr } from "./entities/tenantAddr.entity";
import { Ticdijson } from "./entities/ticdijson.entity";
import { TicdijsonController } from "./ticdijson.controller";
import { TicdijsonService } from "./ticdijson.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticdijson]),
    TypeOrmModule.forFeature([TenantAddr]),
  ],
  controllers: [TicdijsonController],
  providers: [TicdijsonService],
})
export class TicdijsonModule {}
