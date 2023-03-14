import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NFRProvisionVariable } from "src/nfr_provision/entities/nfr_provision_variable.entity";
import { NFRProvision } from "../nfr_provision/entities/nfr_provision.entity";
import { NFRProvisionVariant } from "../nfr_provision/entities/nfr_provision_variant.entity";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataProvision } from "./entities/nfr_data_provision.entity";
import { NFRDataVariable } from "./entities/nfr_data_variable.entity";
import { NFRDataController } from "./nfr_data.controller";
import { NFRDataService } from "./nfr_data.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([NFRData]),
    TypeOrmModule.forFeature([NFRDataProvision]),
    TypeOrmModule.forFeature([NFRProvisionVariable]),
    TypeOrmModule.forFeature([NFRDataVariable]),
    TypeOrmModule.forFeature([NFRProvision]),
    TypeOrmModule.forFeature([NFRProvisionVariant]),
  ],
  controllers: [NFRDataController],
  providers: [NFRDataService],
})
export class NFRDataModule {}
