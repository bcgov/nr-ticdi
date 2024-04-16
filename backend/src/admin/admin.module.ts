import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { DocumentTemplateModule } from 'src/document_template/document_template.module';
import { ProvisionModule } from 'src/provision/provision.module';
import { DocumentTypeModule } from 'src/document_type/document_type.module';
import { TTLSService } from 'src/ttls/ttls.service';

@Module({
  imports: [HttpModule, AuthenticationModule, DocumentTemplateModule, ProvisionModule, DocumentTypeModule],
  providers: [AdminGuard, AdminService, TTLSService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
