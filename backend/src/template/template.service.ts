import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { Template } from "./entities/template.entity";

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>
  ) {}

  async create(templateData: CreateTemplateDto): Promise<Template> {
    const newItem = new Template();
    newItem.template = templateData.template;
    newItem.document_description = templateData.document_description;
    newItem.document_type = templateData.document_type;
    newItem.author = templateData.author;
    const existingReports = await this.templateRepository.findBy({
      document_type: templateData.document_type,
    });
    if (!existingReports) {
      newItem.document_version = "00";
      const newTemplate = this.templateRepository.create(newItem);
      return this.templateRepository.save(newTemplate);
    } else {
      let currentVersion = 0;
      for (let item of existingReports) {
        if (parseInt(item.document_version) > currentVersion) {
          currentVersion = parseInt(item.document_version);
        }
      }
      const newVersion =
        currentVersion + 1 > 9
          ? (currentVersion + 1).toString()
          : "0" + (currentVersion + 1).toString();
      newItem.document_version = newVersion;
      const newTemplate = this.templateRepository.create(newItem);
      return this.templateRepository.save(newTemplate);
    }
  }

  // updates the updated_by and document_version columns
  async update(templateData: UpdateTemplateDto): Promise<Template> {
    let templateToUpdate = await this.templateRepository.findOneByOrFail({
      document_type: templateData.document_type,
      document_version: templateData.document_version,
    });
    const currentVersion = parseInt(templateToUpdate.document_version);
    const newVersion =
      currentVersion + 1 > 9
        ? (currentVersion + 1).toString()
        : "0" + (currentVersion + 1).toString();
    templateToUpdate.document_version = newVersion;
    templateToUpdate.template = templateData.template;
    templateToUpdate.updated_by = templateData.updated_by;
    return this.templateRepository.save(templateToUpdate);
  }

  async findAll(): Promise<Template[]> {
    const template1 = new Template();
    template1.template = "ASDFA231";
    template1.author = "Mike";
    template1.created_date = new Date();
    template1.document_type = "lur";
    template1.document_description = "Land Use Report";
    template1.document_version = "00";
    const template2 = new Template();
    template2.template = "HDFHGDF43";
    template2.author = "Bill";
    template2.created_date = new Date();
    template2.document_type = "rul";
    template2.document_description = "Report Use Land";
    template2.document_version = "01";
    return [template1, template2];
    // return this.templateRepository.find();
  }
}
