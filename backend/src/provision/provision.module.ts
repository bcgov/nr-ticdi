import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provision } from './entities/provision.entity';
import { ProvisionGroup } from './entities/provision_group.entity';
import { ProvisionController } from './provision.controller';
import { ProvisionService } from './provision.service';
import { ProvisionVariable } from './entities/provision_variable.entity';
import { DocumentTypeModule } from 'src/document_type/document_type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provision]),
    TypeOrmModule.forFeature([ProvisionGroup]),
    TypeOrmModule.forFeature([ProvisionVariable]),
    DocumentTypeModule,
  ],
  controllers: [ProvisionController],
  providers: [ProvisionService],
  exports: [ProvisionService],
})
export class ProvisionModule {}