import { PickType } from "@nestjs/swagger";
import { TemplateDto } from "./template.dto";

export class UpdateTemplateDto extends PickType(TemplateDto, [
  "template",
  "document_type",
  "document_version",
  "updated_by",
] as const) {}
