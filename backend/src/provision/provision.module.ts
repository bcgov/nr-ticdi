import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provision } from './entities/provision.entity';
import { ProvisionController } from './provision.controller';
import { ProvisionService } from './provision.service';
import { ProvisionVariable } from './entities/provision_variable.entity';
import { DocumentTypeProvision } from './entities/document_type_provision';
import { DocumentTypeModule } from 'src/document_type/document_type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provision]),
    TypeOrmModule.forFeature([ProvisionVariable]),
    TypeOrmModule.forFeature([DocumentTypeProvision]),
    DocumentTypeModule,
  ],
  controllers: [ProvisionController],
  providers: [ProvisionService],
  exports: [ProvisionService],
})
export class ProvisionModule {}
