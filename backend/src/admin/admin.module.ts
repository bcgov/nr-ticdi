import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { DocumentTemplateModule } from 'src/document_template/document_template.module';
import { ProvisionModule } from 'src/provision/provision.module';
import { DocumentTypeModule } from 'src/document_type/document_type.module';
import { JWTAuthModule } from 'src/auth/jwtauth.module';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { TTLSService } from 'src/ttls/ttls.service';

@Module({
  imports: [HttpModule, JWTAuthModule, DocumentTemplateModule, ProvisionModule, DocumentTypeModule],
  providers: [AdminGuard, AdminService, JwtAuthGuard, TTLSService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
