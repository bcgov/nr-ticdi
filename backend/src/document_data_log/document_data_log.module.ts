import { Module } from '@nestjs/common';
import { DocumentDataLogService } from './document_data_log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentDataLog } from './entities/document_data_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentDataLog])],
  providers: [DocumentDataLogService],
  exports: [DocumentDataLogService, TypeOrmModule.forFeature([DocumentDataLog])],
})
export class DocumentDataLogModule {}
