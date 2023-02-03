import { Injectable, StreamableFile } from "@nestjs/common";
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
    documentTemplate: CreateDocumentTemplateDto & { active_flag: boolean },
    file: any
  ): Promise<DocumentTemplate> {
    const base64File = Buffer.from(file.buffer).toString("base64");
    const newItem = new DocumentTemplate();
    newItem.document_type = documentTemplate.document_type;
    newItem.template_author = documentTemplate.template_author;
    newItem.active_flag = documentTemplate.active_flag;
    newItem.mime_type = documentTemplate.mime_type;
    newItem.file_name = documentTemplate.file_name;
    newItem.comments = documentTemplate.comments;
    newItem.create_userid = documentTemplate.create_userid;
    newItem.the_file = base64File;
    newItem.template_version = await this.getTemplateVersion(documentTemplate);
    const newTemplate = this.documentTemplateRepository.create(newItem);
    return this.documentTemplateRepository.save(newTemplate);
  }

  async getTemplateVersion(
    documentTemplate: CreateDocumentTemplateDto & { active_flag: boolean }
  ): Promise<number> {
    const existingReports = await this.documentTemplateRepository.findBy({
      document_type: documentTemplate.document_type,
    });
    if (!existingReports) {
      return 0;
    } else {
      let currentVersion = 0;
      for (let item of existingReports) {
        if (item.template_version > currentVersion) {
          currentVersion = item.template_version;
        }
      }
      return currentVersion + 1;
    }
  }

  async activateTemplate(data: {
    id: number;
    update_userid: string;
    document_type: string;
  }): Promise<any> {
    let allTemplates = await this.documentTemplateRepository.findBy({
      comments: data.document_type,
    });
    console.log(allTemplates.length);
    for (let entry of allTemplates) {
      if (entry.active_flag == true) {
        await this.documentTemplateRepository.update(
          { id: entry.id },
          { active_flag: false }
        );
      }
    }
    return await this.documentTemplateRepository.update(
      { id: data.id },
      { active_flag: true }
    );
  }

  // updates the updated_by and document_version columns
  // unused - needs to be updated
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
    templateToUpdate.active_flag = templateData.active_flag;
    templateToUpdate.mime_type = templateData.mime_type;
    templateToUpdate.file_name = templateData.file_name;
    templateToUpdate.the_file = templateData.the_file;
    templateToUpdate.comments = templateData.comments;
    return this.documentTemplateRepository.save(templateToUpdate);
  }

  async findAll(): Promise<DocumentTemplate[]> {
    return this.documentTemplateRepository.find();
  }

  async findOne(id: number): Promise<DocumentTemplate> {
    return this.documentTemplateRepository.findOneByOrFail({
      id: id,
    });
  }
}
