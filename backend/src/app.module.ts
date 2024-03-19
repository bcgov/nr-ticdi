import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { DocumentTemplateModule } from './document_template/document_template.module';
import { DocumentDataLogModule } from './document_data_log/document_data_log.module';
import { ProvisionModule } from './provision/provision.module';
import { DocumentDataModule } from './document_data/document_data.module';
import { HttpModule } from '@nestjs/axios';
import { TTLSService } from './ttls/ttls.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { SessionModule } from 'nestjs-session';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { ReportModule } from './report/report.module';
import { DocumentTypeModule } from './document_type/document_type.module';
import { HttpExceptionFilter } from './authentication/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

import config from './ormconfig';

console.log('Var check - POSTGRESQL_HOST', process.env.POSTGRESQL_HOST);
console.log('Var check - POSTGRESQL_DATABASE', process.env.POSTGRESQL_DATABASE);
console.log('Var check - POSTGRESQL_USER', process.env.POSTGRESQL_USER);
if (process.env.POSTGRESQL_PASSWORD != null) {
  console.log('Var check - POSTGRESQL_PASSWORD present');
} else {
  console.log('Var check - POSTGRESQL_PASSWORD not present');
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
    HttpModule,
    AuthenticationModule,
    AdminModule,
    ReportModule,
    SessionModule.forRoot({
      session: { secret: process.env.session_secret },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AppService,
    TTLSService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
