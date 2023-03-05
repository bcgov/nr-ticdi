import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NFRProvision } from "../nfr_provision/entities/nfr_provision.entity";
import { NFRProvisionVariant } from "../nfr_provision/entities/nfr_provision_variant.entity";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataProvision } from "./entities/nfr_data_provision.entity";
import { NFRDataController } from "./nfr_data.controller";
import { NFRDataService } from "./nfr_data.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([NFRData]),
    TypeOrmModule.forFeature([NFRDataProvision]),
    TypeOrmModule.forFeature([NFRProvision]),
    TypeOrmModule.forFeature([NFRProvisionVariant]),
  ],
  controllers: [NFRDataController],
  providers: [NFRDataService],
})
export class NFRDataModule {}
