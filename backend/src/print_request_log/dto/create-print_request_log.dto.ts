import { PickType } from "@nestjs/swagger";
import { PrintRequestLogDto } from "./print_request_log.dto";

export class CreatePrintRequestLogDto extends PickType(PrintRequestLogDto, [
  "document_template_id",
  "print_request_detail_id",
  "request_app_user",
  // "request_timestamp",
  // "request_json",
  // "create_userid",
] as const) {}
