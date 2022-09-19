import { Get, Controller, Render, UseGuards, UseFilters, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { PAGE_TITLES } from 'utils/constants';
import { SessionData } from 'utils/types';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationFilter } from './authentication/authentication.filter';
import { AccountGuard } from './account/account.guard';
import { AccountFilter } from './account/account.filter';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @Render('index')
//  @UseFilters(AuthenticationFilter)
//  @UseGuards(AuthenticationGuard)
  async root(@Session() session: { data?: SessionData }) {
    const username = session.data.name;
    const label =
      session.data.activeAccount !== null && session.data.activeAccount !== undefined
        ? session.data.activeAccount.label
        : session.data.accounts.length == 0
        ? '~'
        : '-';
    return process.env.ticdi_environment == 'DEVELOPMENT'
      ? {
          title: 'DEVELOPMENT - ' + PAGE_TITLES.INDEX,
          username: username,
          label: label,
          accounts: session.data.accounts,
        }
      : {
          title: PAGE_TITLES.INDEX,
          username: username,
          label: label,
          accounts: session.data.accounts,
        };
  }
}
