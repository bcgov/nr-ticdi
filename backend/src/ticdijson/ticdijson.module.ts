import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticdijson } from "./entities/ticdijson.entity";
import { TicdijsonController } from "./ticdijson.controller";
import { TicdijsonService } from "./ticdijson.service";

@Module({
  imports: [TypeOrmModule.forFeature([Ticdijson])],
  controllers: [TicdijsonController],
  providers: [TicdijsonService],
})
export class TicdijsonModule {}
