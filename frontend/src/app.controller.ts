import { Get, Controller, Render, Param, StreamableFile, Header, UseGuards, UseFilters, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { PAGE_TITLES } from 'utils/constants';
import { SessionData } from 'utils/types';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationFilter } from './authentication/authentication.filter';
import { AccountGuard } from './account/account.guard';
import { AccountFilter } from './account/account.filter';
import { TTLSService } from './ttls/ttls.service'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService, private readonly ttlsService: TTLSService) {}

  @Get()
  @Render('index')
  //@UseFilters(AuthenticationFilter)
  //@UseGuards(AuthenticationGuard)
  async root(@Session() session: { data?: SessionData }) {
    const username = 'Test User'; //session.data.name;
    const label = 'Test Label';
    const accounts = 'Test Account';
      //session.data.activeAccount !== null && session.data.activeAccount !== undefined
      //  ? session.data.activeAccount.label
      //  : session.data.accounts.length == 0
      //  ? '~'
      //  : '-';
    return process.env.ticdi_environment == 'DEVELOPMENT'
      ? {
          title: 'DEVELOPMENT - ' + PAGE_TITLES.INDEX,
          username: username,
          label: label,
          accounts: accounts,//session.data.accounts,
        }
      : {
          title: PAGE_TITLES.INDEX,
          username: username,
          label: label,
          accounts: accounts,//session.data.accounts,
        };
  }

  @Get('dtid/:id/:docname')
  @Render('index')
  async findOne(@Param('id') id, @Param('docname') docname :string) {

    var ttlsJSON = {}
    this.ttlsService.setId(id);
    await this.ttlsService.callHttp().toPromise().then(resp => {
    ttlsJSON = resp;
      this.ttlsService.setJSONDataFile(ttlsJSON);
    }, reason => {
      console.log("Error")
    })

    return { message: ttlsJSON };
  }

  @Get('generateReport')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=landusereport.docx')
  async generateReport() {

    return new StreamableFile(await this.ttlsService.generateLURReport());
  }
}
