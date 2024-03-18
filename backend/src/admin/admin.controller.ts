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
} from '@nestjs/common';
import { ExportDataObject, SessionData, UserObject } from 'utils/types';
import { AxiosRequestConfig } from 'axios';
import { AdminService } from './admin.service';
import { AuthenticationFilter } from 'src/authentication/authentication.filter';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { AdminGuard } from './admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as stream from 'stream';

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@Controller('admin')
// @UseFilters(AuthenticationFilter)
// @UseGuards(AuthenticationGuard)
// @UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {
    const hostname = process.env.backend_url ? process.env.backend_url : `http://localhost`;
    const port = process.env.backend_url ? 3000 : 3001;
    requestUrl = `${hostname}:${port}/template/`;
    requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  @Get('activate-template/:id/:document_type_id')
  async activateTemplate(
    @Session() session: { data?: SessionData },
    @Param('id') id: number,
    @Param('document_type_id') document_type_id: number
  ) {
    const update_userid = session?.data?.activeAccount
      ? session.data.activeAccount.idir_username
        ? session.data.activeAccount.idir_username
        : ''
      : '';
    return this.adminService.activateTemplate({
      id: id,
      update_userid: update_userid,
      document_type_id: document_type_id,
    });
  }

  @Get('download-template/:id')
  async downloadTemplate(@Param('id') id: number, @Res() res) {
    const dtObject = await this.adminService.downloadTemplate(id);
    const base64Data = dtObject.the_file;
    const buffer = Buffer.from(base64Data, 'base64');
    const streamableFile = new stream.PassThrough();
    streamableFile.end(buffer);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=file.docx',
    });
    streamableFile.pipe(res);
  }

  @Get('remove-template/:id/:document_type_id')
  async removeTemplate(@Param('id') id: number, @Param('document_type_id') document_type_id: number) {
    return this.adminService.removeTemplate(document_type_id, id);
  }

  @Post('upload-template')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate2(
    @Session() session: { data?: SessionData },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({
            fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          }), // checks the mimetype
        ],
      })
    )
    file: Express.Multer.File,
    @Body()
    params: {
      document_type_id: number;
      template_name: string;
    }
  ) {
    const create_userid = session?.data?.activeAccount
      ? session.data.activeAccount.idir_username
        ? session.data.activeAccount.idir_username
        : ''
      : '';
    const template_author = session?.data?.activeAccount
      ? session.data.activeAccount.name
        ? session.data.activeAccount.name
        : ''
      : '';
    const uploadData = {
      document_type_id: params.document_type_id,
      active_flag: false,
      mime_type: file.mimetype,
      file_name: params.template_name,
      template_author: template_author,
      create_userid: create_userid,
    };
    await this.adminService.uploadTemplate(uploadData, file);
    return { message: 'Template uploaded successfully' };
  }

  // @Post('upload-template')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadTemplate(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
  //   console.log(file); // Check if the file is received correctly
  //   console.log(body); // Log the body to see if other data is as expected
  //   return { message: 'Debugging' };
  // }

  /**
   * Used for an AJAX route to render all admins in a datatable
   * @returns altered admin object array
   */
  @Get('get-admins')
  getAdmins(): Promise<UserObject[]> {
    return this.adminService.getAdminUsers();
  }

  @Get('get-export-data')
  getExportData(): Promise<string> {
    return this.adminService.getExportData();
  }

  @Post('add-admin')
  async addAdmin(@Body() searchInputs: { idirUsername: string }): Promise<{ userObject: UserObject; error: string }> {
    try {
      const user = await this.adminService.addAdmin(searchInputs.idirUsername);
      return { userObject: user, error: null };
    } catch (err) {
      return { userObject: null, error: err.message };
    }
  }

  @Post('search-users')
  async searchUsers(@Body() searchInputs: { email: string }): Promise<{
    userObject: {
      firstName: string;
      lastName: string;
      username: string;
      idirUsername: string;
    };
    error: string;
  }> {
    try {
      const user = await this.adminService.searchUsers(searchInputs.email);
      return { userObject: user, error: null };
    } catch (err) {
      return { userObject: null, error: err.message };
    }
  }

  @Post('remove-admin')
  removeAdmin(@Body() input: { idirUsername: string }): Promise<{ message: string }> {
    return this.adminService.removeAdmin(input.idirUsername);
  }

  // @Get('templates/:reportId')
  // getTemplates(@Param('reportId') reportId: number): Promise<any> {
  //   return this.adminService.getTemplates(reportId);
  // }

  @Get('open-document/:document_id')
  setSessionDocument(@Session() session: { data?: SessionData }, @Param('document_id') documentId: number): void {
    session.data.selected_document = { document_id: documentId };
  }

  @Get('get-templates/:document_type_id')
  getDocumentTemplates(@Param('document_type_id') document_type_id: number): any {
    return this.adminService.getDocumentTemplates(document_type_id);
  }

  @Get('provisions')
  getDocumentProvisions(): any {
    return this.adminService.getDocumentProvisions();
  }

  @Get('document-variables')
  getDocumentVariables(): any {
    return this.adminService.getDocumentVariables();
  }

  @Get('enable-provision/:provisionId')
  enableProvision(@Param('provisionId') id: number): any {
    return this.adminService.enableProvision(id);
  }

  @Get('disable-provision/:provisionId')
  disableProvision(@Param('provisionId') id: number): any {
    return this.adminService.disableProvision(id);
  }

  @Get('get-group-max')
  getGroupMax() {
    return this.adminService.getGroupMax();
  }

  @Post('add-provision')
  addProvision(
    @Body()
    provisionParams: {
      type: string;
      provision_group: number;
      provision_group_text: string;
      max: number;
      provision: string;
      free_text: string;
      help_text: string;
      category: string;
      variants: number[];
    },
    @Session() session: { data?: SessionData }
  ) {
    const create_userid = session?.data?.activeAccount.idir_username;
    return this.adminService.addProvision(provisionParams, create_userid);
  }

  @Post('update-provision')
  updateProvision(
    @Body()
    provisionParams: {
      id: number;
      type: string;
      provision_group: number;
      provision_group_text: string;
      max: number;
      provision: string;
      free_text: string;
      help_text: string;
      category: string;
      document_type_ids: number[];
    },
    @Session() session: { data?: SessionData }
  ) {
    const update_userid = session?.data?.activeAccount.idir_username;
    return this.adminService.updateProvision(provisionParams, update_userid);
  }

  @Post('add-variable')
  addVariable(
    @Body()
    variableParams: {
      variable_name: string;
      variable_value: string;
      help_text: string;
      provision_id: number;
    },
    @Session() session: { data?: SessionData }
  ) {
    const create_userid = session?.data?.activeAccount.idir_username;
    return this.adminService.addVariable(variableParams, create_userid);
  }

  @Post('update-variable')
  updateVariable(
    @Body()
    variableParams: {
      id: number;
      variable_name: string;
      variable_value: string;
      help_text: string;
      provision_id: number;
    },
    @Session() session: { data?: SessionData }
  ) {
    const update_userid = session?.data?.activeAccount.idir_username;
    return this.adminService.updateVariable({ ...variableParams, update_userid });
  }

  @Get('remove-variable/:id')
  removeVariable(@Param('id') id: number) {
    return this.adminService.removeVariable(id);
  }
}
