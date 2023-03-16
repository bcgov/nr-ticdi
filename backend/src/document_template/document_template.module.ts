import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentTemplateController } from "./document_template.controller";
import { DocumentTemplateService } from "./document_template.service";
import { DocumentTemplate } from "./entities/document_template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTemplate])],
  controllers: [DocumentTemplateController],
  providers: [DocumentTemplateService],
  exports: [DocumentTemplateService],
})
export class DocumentTemplateModule {}
