import { PickType } from "@nestjs/swagger";
import { TemplateDto } from "./template.dto";

export class CreateTemplateDto extends PickType(TemplateDto, [
  "template",
  "document_description",
  "document_type",
  "author",
] as const) {}
