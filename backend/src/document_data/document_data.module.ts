import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTemplateModule } from 'src/document_template/document_template.module';
import { ProvisionVariable } from 'src/provision/entities/provision_variable.entity';
import { ProvisionModule } from 'src/provision/provision.module';
import { Provision } from '../provision/entities/provision.entity';
import { DocumentData } from './entities/document_data.entity';
import { DocumentDataProvision } from './entities/document_data_provision.entity';
import { DocumentDataVariable } from './entities/document_data_variable.entity';
import { DocumentDataController } from './document_data.controller';
import { DocumentDataService } from './document_data.service';
import { DocumentDataLog } from 'src/document_data_log/entities/document_data_log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentData]),
    TypeOrmModule.forFeature([DocumentDataProvision]),
    TypeOrmModule.forFeature([ProvisionVariable]),
    TypeOrmModule.forFeature([DocumentDataVariable]),
    TypeOrmModule.forFeature([Provision]),
    ProvisionModule,
    DocumentTemplateModule,
  ],
  controllers: [DocumentDataController],
  providers: [DocumentDataService],
  exports: [DocumentDataService],
})
export class DocumentDataModule {}
