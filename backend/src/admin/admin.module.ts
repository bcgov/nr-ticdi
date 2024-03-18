import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { DocumentTemplateModule } from 'src/document_template/document_template.module';
import { ProvisionModule } from 'src/provision/provision.module';

@Module({
  imports: [HttpModule, AuthenticationModule, DocumentTemplateModule, ProvisionModule],
  providers: [AdminGuard, AdminService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
