import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NFRProvision } from './entities/nfr_provision.entity';
import { NFRProvisionGroup } from './entities/nfr_provision_group.entity';
import { NFRProvisionVariant } from './entities/nfr_provision_variant.entity';
import { NFRProvisionController } from './nfr_provision.controller';
import { NFRProvisionService } from './nfr_provision.service';
import { NFRProvisionVariable } from './entities/nfr_provision_variable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NFRProvision]),
    TypeOrmModule.forFeature([NFRProvisionGroup]),
    TypeOrmModule.forFeature([NFRProvisionVariable]),
    TypeOrmModule.forFeature([NFRProvisionVariant]),
  ],
  controllers: [NFRProvisionController],
  providers: [NFRProvisionService],
  exports: [NFRProvisionService],
})
export class NFRProvisionModule {}
