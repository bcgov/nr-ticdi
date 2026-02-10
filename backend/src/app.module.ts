import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { DocumentTemplateModule } from './document_template/document_template.module';
import { DocumentDataLogModule } from './document_data_log/document_data_log.module';
import { ProvisionModule } from './provision/provision.module';
import { DocumentDataModule } from './document_data/document_data.module';
import { TTLSService } from './ttls/ttls.service';
import { SessionModule } from 'nestjs-session';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { ReportModule } from './report/report.module';
import { DocumentTypeModule } from './document_type/document_type.module';

import config from './ormconfig';
import { JWTAuthModule } from './auth/jwtauth.module';

console.log('Var check - POSTGRES_HOST', process.env.POSTGRES_HOST);
console.log('Var check - POSTGRES_DATABASE', process.env.POSTGRES_DATABASE);
console.log('Var check - POSTGRES_USER', process.env.POSTGRES_USER);
if (process.env.POSTGRES_PASSWORD != null) {
  console.log('Var check - POSTGRES_PASSWORD present');
} else {
  console.log('Var check - POSTGRES_PASSWORD not present');
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    DocumentTemplateModule,
    DocumentTypeModule,
    DocumentDataModule,
    DocumentDataLogModule,
    ProvisionModule,
    JWTAuthModule,
    AdminModule,
    ReportModule,
    SessionModule.forRoot({
      session: { secret: process.env.session_secret },
    }),
  ],
  controllers: [AdminController],
  providers: [AppService, TTLSService],
})
export class AppModule {}
