import {
  Controller,
  Post,
  Session,
  Body,
  UseFilters,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { SessionData } from "utils/types";
import { AxiosRequestConfig } from "axios";
import { AdminService } from "./admin.service";
import { AuthenticationFilter } from "src/authentication/authentication.filter";
import { AuthenticationGuard } from "src/authentication/authentication.guard";
import { AdminGuard } from "./admin.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@Controller("admin")
@UseFilters(AuthenticationFilter)
@UseGuards(AuthenticationGuard)
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {
    const hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    const port = process.env.backend_url ? 3000 : 3001;
    requestUrl = `${hostname}:${port}/template/`;
    requestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  @Post("upload-template")
  @UseInterceptors(FileInterceptor("file"))
  async uploadTemplate2(
    @Session() session: { data?: SessionData },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({
            fileType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          }), // checks the mimetype
        ],
      })
    )
    file: Express.Multer.File,
    @Body() params: { comments: string; active_flag: boolean }
  ) {
    let isAdmin = false;
    if (
      session.data &&
      session.data.activeAccount &&
      session.data.activeAccount.client_roles
    ) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == "ticdi_admin") {
          isAdmin = true;
        }
      }
    }
    if (isAdmin) {
      const create_userid = session.data.activeAccount
        ? session.data.activeAccount.idir_username
          ? session.data.activeAccount.idir_username
          : ""
        : "";
      const template_author = session.data.activeAccount
        ? session.data.activeAccount.name
          ? session.data.activeAccount.name
          : ""
        : "";
      const uploadData = {
        document_type: "",
        comments: params.comments,
        active_flag: params.active_flag,
        mime_type: file.mimetype,
        file_name: file.originalname,
        template_author: template_author,
        create_userid: create_userid,
      };
      return this.adminService.uploadTemplate(uploadData, file);
    } else {
      return { message: "No Admin Privileges Found" };
    }
  }
}
