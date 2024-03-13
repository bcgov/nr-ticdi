import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTemplateController } from './document_template.controller';
import { DocumentTemplateService } from './document_template.service';
import { DocumentTemplate } from './entities/document_template.entity';
import { DocumentData } from 'src/document_data/entities/document_data.entity';
import { DocumentTypeModule } from 'src/document_type/document_type.module';
import { DocumentType } from 'src/document_type/entities/document_type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentTemplate]),
    TypeOrmModule.forFeature([DocumentData]),
    TypeOrmModule.forFeature([DocumentType]),
    DocumentTypeModule,
  ],
  controllers: [DocumentTemplateController],
  providers: [DocumentTemplateService],
  exports: [DocumentTemplateService],
})
export class DocumentTemplateModule {}
