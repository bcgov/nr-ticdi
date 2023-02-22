import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NFRProvision } from "./entities/nfr_provision.entity";
import { NFRProvisionController } from "./nfr_provision.controller";
import { NFRProvisionService } from "./nfr_provision.service";

@Module({
  imports: [TypeOrmModule.forFeature([NFRProvision])],
  controllers: [NFRProvisionController],
  providers: [NFRProvisionService],
})
export class NFRProvisionModule {}
