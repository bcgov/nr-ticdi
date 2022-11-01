import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Template } from "./entities/template.entity";
import { TemplateController } from "./template.controller";
import { TemplateService } from "./template.service";

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
