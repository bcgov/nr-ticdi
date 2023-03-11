import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataController } from "./nfr_data.controller";
import { NFRDataService } from "./nfr_data.service";

@Module({
  imports: [TypeOrmModule.forFeature([NFRData])],
  controllers: [NFRDataController],
  providers: [NFRDataService],
})
export class NFRDataModule {}
