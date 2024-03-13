import { Module } from '@nestjs/common';
import { DocumentTypeService } from './document_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeController } from './document_type.controller';
import { DocumentType } from './entities/document_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType])],
  providers: [DocumentTypeService],
  controllers: [DocumentTypeController],
  exports: [DocumentTypeService],
})
export class DocumentTypeModule {}
