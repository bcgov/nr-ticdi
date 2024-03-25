import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provision } from './entities/provision.entity';
import { ProvisionController } from './provision.controller';
import { ProvisionService } from './provision.service';
import { ProvisionVariable } from './entities/provision_variable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provision]), TypeOrmModule.forFeature([ProvisionVariable])],
  controllers: [ProvisionController],
  providers: [ProvisionService],
  exports: [ProvisionService],
})
export class ProvisionModule {}
