import { PickType } from "@nestjs/swagger";
import { DocumentTemplateDto } from "./document_template.dto";

export class CreateDocumentTemplateDto extends PickType(DocumentTemplateDto, [
  "document_type",
  "template_version",
  "template_author",
  "template_creation_date",
  "active_flag",
  "mime_type",
  "file_name",
  "the_file",
  "comments",
  "create_userid",
] as const) {}
