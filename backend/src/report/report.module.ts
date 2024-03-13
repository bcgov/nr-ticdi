import { Module } from '@nestjs/common';
import { TTLSService } from '../ttls/ttls.service';
import { ReportController } from './report.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ReportService } from './report.service';
import { HttpModule } from '@nestjs/axios';
import { DocumentTemplateModule } from 'src/document_template/document_template.module';
import { ProvisionModule } from 'src/provision/provision.module';
import { DocumentDataModule } from 'src/document_data/document_data.module';
import { DocumentDataLogModule } from 'src/document_data_log/document_data_log.module';
import { DocumentDataLogService } from 'src/document_data_log/document_data_log.service';

@Module({
  imports: [
    HttpModule,
    AuthenticationModule,
    DocumentTemplateModule,
    ProvisionModule,
    DocumentDataModule,
    DocumentDataLogModule,
  ],
  providers: [TTLSService, ReportService, DocumentDataLogService],
  exports: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
