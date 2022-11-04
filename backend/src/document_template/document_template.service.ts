import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDocumentTemplateDto } from "./dto/create-document_template.dto";
import { UpdateDocumentTemplateDto } from "./dto/update-document_template.dto";
import { DocumentTemplate } from "./entities/document_template.entity";

@Injectable()
export class DocumentTemplateService {
  constructor(
    @InjectRepository(DocumentTemplate)
    private documentTemplateRepository: Repository<DocumentTemplate>
  ) {}

  async create(
    documentTemplate: CreateDocumentTemplateDto
  ): Promise<DocumentTemplate> {
    const newItem = new DocumentTemplate();
    newItem.document_type = documentTemplate.document_type;
    newItem.template_version = documentTemplate.template_version;
    newItem.template_author = documentTemplate.template_author;
    newItem.template_creation_date = documentTemplate.template_creation_date;
    newItem.active_flag = documentTemplate.active_flag;
    newItem.mime_type = documentTemplate.mime_type;
    newItem.file_name = documentTemplate.file_name;
    newItem.the_file = documentTemplate.the_file;
    newItem.comments = documentTemplate.comments;
    newItem.create_userid = documentTemplate.create_userid;
    const existingReports = await this.documentTemplateRepository.findBy({
      document_type: documentTemplate.document_type,
    });
    if (!existingReports) {
      newItem.template_version = 0;
      const newTemplate = this.documentTemplateRepository.create(newItem);
      return this.documentTemplateRepository.save(newTemplate);
    } else {
      let currentVersion = 0;
      for (let item of existingReports) {
        if (item.template_version > currentVersion) {
          currentVersion = item.template_version;
        }
      }
      //   const newVersion =
      //     currentVersion + 1 > 9
      //       ? (currentVersion + 1).toString()
      //       : "0" + (currentVersion + 1).toString();
      newItem.template_version = currentVersion + 1;
      const newTemplate = this.documentTemplateRepository.create(newItem);
      return this.documentTemplateRepository.save(newTemplate);
    }
  }

  // updates the updated_by and document_version columns
  async update(
    templateData: UpdateDocumentTemplateDto
  ): Promise<DocumentTemplate> {
    let allTemplates = await this.documentTemplateRepository.findBy({
      document_type: templateData.document_type,
    });
    let mostRecentTemplate = allTemplates[0];
    for (let template of allTemplates) {
      if (template.template_version > mostRecentTemplate.template_version) {
        mostRecentTemplate = template;
      }
    }
    let templateToUpdate =
      await this.documentTemplateRepository.findOneByOrFail({
        document_type: templateData.document_type,
        template_version: templateData.template_version,
      });
    templateToUpdate.document_type = templateData.document_type;
    templateToUpdate.template_version = mostRecentTemplate.template_version + 1;
    templateToUpdate.template_author = templateData.template_author;
    templateToUpdate.template_creation_date =
      templateData.template_creation_date;
    templateToUpdate.active_flag = templateData.active_flag;
    templateToUpdate.mime_type = templateData.mime_type;
    templateToUpdate.file_name = templateData.file_name;
    templateToUpdate.the_file = templateData.the_file;
    templateToUpdate.comments = templateData.comments;
    return this.documentTemplateRepository.save(templateToUpdate);
  }

  async findAll(): Promise<DocumentTemplate[]> {
    const template1 = new DocumentTemplate();
    template1.the_file = "ASDFA231";
    template1.template_author = "Mike";
    template1.template_creation_date = new Date().toLocaleString();
    template1.document_type = "lur";
    template1.comments = "Land Use Report";
    template1.template_version = 0;
    const template2 = new DocumentTemplate();
    template2.the_file = "HDFHGDF43";
    template2.template_author = "Bill";
    template2.template_creation_date = new Date().toLocaleString();
    template2.document_type = "rul";
    template2.comments = "Report Use Land";
    template2.template_version = 1;
    return [template1, template2];
    // return this.documentTemplateRepository.find();
  }
}
