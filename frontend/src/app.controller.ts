/* eslint-disable no-useless-constructor */
import { Controller, Get, Param, Render,StreamableFile, Header  } from '@nestjs/common'
import { AppService } from './app.service'
import { HttpConsumingService } from './app.service.ttls'



@Controller()
export class AppController {
  constructor (private readonly appService: AppService, private readonly http: HttpConsumingService) {}

  @Get()
  getHello (): string {
    return this.appService.getHello()
  }

  @Get('dtid/:id/:docname')
  @Render('index')
  async findOne(@Param('id') id, @Param('docname') docname :string) {

    var ttlsJSON = {}
    this.http.setId(id);
    await this.http.callHttp().toPromise().then(resp => {
    ttlsJSON = resp;
      this.http.setJSONDataFile(ttlsJSON);
    }, reason => {
      console.log("Error")
    })

    return { message: ttlsJSON };
  }

  @Get('generateReport')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=landusereport.docx')
  async generateReport() {

    return new StreamableFile(await this.http.generateReport());
  }
 

}
