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
  Get,
  Param,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { SessionData } from "utils/types";
import { AxiosRequestConfig } from "axios";
import { AdminService } from "./admin.service";
import { AuthenticationFilter } from "src/authentication/authentication.filter";
import { AuthenticationGuard } from "src/authentication/authentication.guard";
import { AdminGuard } from "./admin.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import * as stream from "stream";

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

  @Get("activate-template/:id/:document_type")
  async activateTemplate(
    @Session() session: { data?: SessionData },
    @Param("id") id,
    @Param("document_type") document_type
  ) {
    const update_userid = session.data.activeAccount
      ? session.data.activeAccount.idir_username
        ? session.data.activeAccount.idir_username
        : ""
      : "";
    return this.adminService.activateTemplate({
      id: id,
      update_userid: update_userid,
      document_type: document_type,
    });
  }

  @Get("download-template/:id")
  async downloadTemplate(@Param("id") id, @Res() res) {
    const dtObject = await this.adminService.downloadTemplate(id);
    const base64Data = dtObject.the_file;
    const buffer = Buffer.from(base64Data, "base64");
    const streamableFile = new stream.PassThrough();
    streamableFile.end(buffer);
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=file.docx",
    });
    streamableFile.pipe(res);
  }

  @Get("remove-template/:reportType/:id")
  async removeTemplate(
    @Param("reportType") reportType: string,
    @Param("id") id: number
  ) {
    return this.adminService.removeTemplate(reportType, id);
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
    @Body()
    params: {
      document_type: string;
      active_flag: boolean;
      template_name: string;
    }
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
        document_type: params.document_type,
        active_flag: params.active_flag,
        mime_type: file.mimetype,
        file_name: params.template_name,
        template_author: template_author,
        create_userid: create_userid,
      };
      await this.adminService.uploadTemplate(uploadData, file);
      return { message: "Template uploaded successfully" };
    } else {
      return { message: "No Admin Privileges Found" };
    }
  }

  @Get("search-users/:searchInput")
  async searchUsers(
    @Session() session: { data?: SessionData },
    @Param("searchInput") searchInput
  ): Promise<any> {
    console.log(searchInput);
    return [
      {
        name: "Eric Anderson",
        username: "ERANDERS",
        role: "TICDIUSER",
        status: "Active",
      },
      {
        name: "Phil Arctander",
        username: "PARCTAN",
        role: "TICDIADMIN",
        status: "Active",
      },
    ];
  }
}
