import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateDocumentTemplateDto } from './dto/create-document_template.dto';
import { UpdateDocumentTemplateDto } from './dto/update-document_template.dto';
import { DocumentTemplate } from './entities/document_template.entity';
import { DocumentType } from '../document_type/entities/document_type.entity';
import { DocumentData } from 'src/document_data/entities/document_data.entity';
import { DocumentTypeService } from 'src/document_type/document_type.service';

@Injectable()
export class DocumentTemplateService {
  constructor(
    private documentTypeService: DocumentTypeService,
    @InjectRepository(DocumentTemplate)
    private documentTemplateRepository: Repository<DocumentTemplate>,
    @InjectRepository(DocumentData)
    private documentDataRepository: Repository<DocumentData>
  ) {}

  async create(documentTemplate: CreateDocumentTemplateDto, file: any): Promise<DocumentTemplate> {
    const base64File = Buffer.from(file.buffer).toString('base64');
    const newItem = new DocumentTemplate();
    const docType: DocumentType = await this.documentTypeService.findById(documentTemplate.document_type_id);
    newItem.document_type = docType;
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

  async getTemplateVersion(documentTemplate: CreateDocumentTemplateDto): Promise<number> {
    const existingTemplates = await this.documentTemplateRepository
      .createQueryBuilder('documentTemplate')
      .leftJoin('documentTemplate.document_type', 'documentType')
      .where('documentType.id = :documentTypeId', { documentTypeId: documentTemplate.document_type_id })
      .getMany();

    if (!existingTemplates || existingTemplates.length === 0) {
      return 1;
    } else {
      let currentVersion = existingTemplates.reduce((max, item) => Math.max(max, item.template_version), 0);
      return currentVersion + 1;
    }
  }

  async activateTemplate(data: { id: number; update_userid: string; document_type_id: number }): Promise<any> {
    const allTemplates = await this.documentTemplateRepository
      .createQueryBuilder('documentTemplate')
      .leftJoin('documentTemplate.document_type', 'documentType')
      .where('documentType.id = :documentTypeId', { documentTypeId: data.document_type_id })
      .getMany();
    for (let entry of allTemplates) {
      if (entry.active_flag == true) {
        await this.documentTemplateRepository.update({ id: entry.id }, { active_flag: false });
      }
    }
    const activatedTemplate = await this.documentTemplateRepository.update({ id: data.id }, { active_flag: true });
    await this.updateTemplates(data.document_type_id);
    return activatedTemplate;
  }

  async checkForActiveTemplates(data: { id: number; update_userid: string; document_type_id: number }): Promise<any> {
    const allTemplates = await this.documentTemplateRepository
      .createQueryBuilder('documentTemplate')
      .leftJoin('documentTemplate.document_type', 'documentType')
      .where('documentType.id = :documentTypeId', { documentTypeId: data.document_type_id })
      .getMany();
    for (let entry of allTemplates) {
      if (entry.active_flag == true) {
        return true;
      }
    }
    // if no active templates, make this one active
    return await this.documentTemplateRepository.update({ id: data.id }, { active_flag: true });
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

  async remove(document_type_id: number, id: number): Promise<{ id: number }> {
    // if the removed template was active, activate the highest version template
    const templateToRemove = await this.findOne(id);
    await this.documentTemplateRepository.update({ id: id }, { is_deleted: true, active_flag: false });
    if (templateToRemove.active_flag == true) {
      const allTemplates: DocumentTemplate[] = await this.findAll(document_type_id);
      if (allTemplates.length != 0) {
        let newestVersionTemplate: DocumentTemplate;
        let currentVersion = 0;
        for (let entry of allTemplates) {
          if (entry.is_deleted == false && entry.template_version > currentVersion) {
            currentVersion = entry.template_version;
            newestVersionTemplate = entry;
          }
        }
        await this.activateTemplate({
          id: newestVersionTemplate.id,
          update_userid: newestVersionTemplate.update_userid,
          document_type_id: document_type_id,
        });
        await this.updateTemplates(document_type_id);
        return { id: newestVersionTemplate.id };
      }
    }
    await this.updateTemplates(document_type_id);
    return { id: 0 };
  }

  // updates the updated_by and document_version columns
  // unused - needs to be updated
  // async update(templateData: UpdateDocumentTemplateDto): Promise<DocumentTemplate> {
  //   const docType: DocumentType = await this.documentTypeService.findById(templateData.document_type_id);
  //   const allTemplates = await this.documentTemplateRepository
  //     .createQueryBuilder('documentTemplate')
  //     .leftJoin('documentTemplate.document_type', 'documentType')
  //     .where('documentType.id = :documentTypeId', { documentTypeId: templateData.document_type_id })
  //     .getMany();
  //   let mostRecentTemplate = allTemplates[0];
  //   for (let template of allTemplates) {
  //     if (template.template_version > mostRecentTemplate.template_version) {
  //       mostRecentTemplate = template;
  //     }
  //   }
  //   let templateToUpdate = await this.documentTemplateRepository.findOneByOrFail({
  //     document_type: { id: templateData.document_type_id },
  //     template_version: templateData.template_version,
  //   });
  //   templateToUpdate.document_type = docType;
  //   templateToUpdate.template_version = mostRecentTemplate.template_version + 1;
  //   templateToUpdate.template_author = templateData.template_author;
  //   templateToUpdate.active_flag = templateData.active_flag;
  //   templateToUpdate.mime_type = templateData.mime_type;
  //   templateToUpdate.file_name = templateData.file_name;
  //   templateToUpdate.the_file = templateData.the_file;
  //   templateToUpdate.comments = templateData.comments;
  //   return this.documentTemplateRepository.save(templateToUpdate);
  // }

  async findAll(document_type_id: number): Promise<DocumentTemplate[]> {
    return this.documentTemplateRepository.find({
      where: { is_deleted: false, document_type: { id: document_type_id } },
    });
  }

  async findActiveByDocumentType(document_type_id: number): Promise<DocumentTemplate> {
    return this.documentTemplateRepository.findOneBy({
      document_type: { id: document_type_id },
      active_flag: true,
    });
  }

  getReportTemplate(report_id: number): Promise<DocumentTemplate> {
    return this.documentTemplateRepository.findOneBy({
      id: report_id,
      active_flag: true,
    });
  }

  findOne(id: number): Promise<DocumentTemplate> {
    return this.documentTemplateRepository.findOneByOrFail({
      id: id,
    });
  }

  // after removing a template, this updates documentData that is now tied to inactive templates
  async updateTemplates(document_type_id: number) {
    const documentData: DocumentData[] = await this.documentDataRepository.findBy({
      document_type: { id: document_type_id },
    });
    const activeTemplate = await this.documentTemplateRepository.findOne({
      where: { document_type: { id: document_type_id }, active_flag: true },
    });

    for (let item of documentData) {
      if (item.template_id != activeTemplate.id) {
        await this.documentDataRepository.update(item.id, {
          template_id: activeTemplate.id,
        });
      }
    }
    return null;
  }
}
