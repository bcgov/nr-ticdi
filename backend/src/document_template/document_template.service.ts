import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, UpdateResult } from "typeorm";
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
    documentTemplate: CreateDocumentTemplateDto,
    file: any
  ): Promise<DocumentTemplate> {
    const base64File = Buffer.from(file.buffer).toString("base64");
    const newItem = new DocumentTemplate();
    newItem.document_type = documentTemplate.document_type;
    newItem.template_author = documentTemplate.template_author;
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
    documentTemplate: CreateDocumentTemplateDto
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
      document_type: data.document_type,
    });
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

  async checkForActiveTemplates(data: {
    id: number;
    update_userid: string;
    document_type: string;
  }): Promise<any> {
    let allTemplates = await this.documentTemplateRepository.findBy({
      document_type: data.document_type,
    });
    for (let entry of allTemplates) {
      if (entry.active_flag == true) {
        return true;
      }
    }
    // if no active templates, make this one active
    return await this.documentTemplateRepository.update(
      { id: data.id },
      { active_flag: true }
    );
  }

  async getTemplatesInfoByIds(ids: number[]): Promise<any[]> {
    const templates = await this.documentTemplateRepository.findBy({
      id: In(ids),
    });

    const result = [];

    for (const template of templates) {
      const trimmedEntry = {
        id: template.id,
        file_name: template.file_name,
        active_flag: template.active_flag,
        is_deleted: template.is_deleted,
        template_version: template.template_version,
      };
      result.push(trimmedEntry);
    }

    return result;
  }

  async remove(document_type: string, id: number): Promise<{ id: number }> {
    // if the removed template was active, activate the highest version template
    const templateToRemove = await this.findOne(id);
    await this.documentTemplateRepository.update(
      { id: id },
      { is_deleted: true, active_flag: false }
    );
    if (templateToRemove.active_flag == true) {
      const allTemplates = await this.findAll(document_type);
      if (allTemplates.length != 0) {
        let newestVersionTemplate: DocumentTemplate;
        let currentVersion = 0;
        for (let entry of allTemplates) {
          if (entry.template_version > currentVersion) {
            currentVersion = entry.template_version;
            newestVersionTemplate = entry;
          }
        }
        await this.activateTemplate(newestVersionTemplate);
        return { id: newestVersionTemplate.id };
      }
    }
    return { id: 0 };
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

  findAll(document_type: string): Promise<DocumentTemplate[]> {
    return this.documentTemplateRepository.find({
      where: { is_deleted: false, document_type: document_type },
    });
  }

  findActiveByDocumentType(document: number): Promise<DocumentTemplate> {
    const document_type =
      document == 1
        ? "Land Use Report"
        : document == 2
        ? "Notice of Final Review"
        : "";
    return this.documentTemplateRepository.findOneBy({
      document_type: document_type,
      active_flag: true,
    });
  }

  findOne(id: number): Promise<DocumentTemplate> {
    return this.documentTemplateRepository.findOneByOrFail({
      id: id,
    });
  }
}
