import { Module } from '@nestjs/common';
import { DocumentTypeService } from './document_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeController } from './document_type.controller';
import { DocumentType } from './entities/document_type.entity';
import { ProvisionGroup } from './entities/provision_group.entity';
import { DocumentTypeProvision } from 'src/provision/entities/document_type_provision';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentType]),
    TypeOrmModule.forFeature([ProvisionGroup]),
    TypeOrmModule.forFeature([DocumentTypeProvision]),
  ],
  providers: [DocumentTypeService],
  controllers: [DocumentTypeController],
  exports: [DocumentTypeService],
})
export class DocumentTypeModule {}
