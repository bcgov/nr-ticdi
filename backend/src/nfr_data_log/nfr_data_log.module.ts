import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NFRDataLog } from './entities/nfr_data_log.entity';
import { NFRDataLogController } from './nfr_data_log.controller';
import { NFRDataLogService } from './nfr_data_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([NFRDataLog])],
  controllers: [NFRDataLogController],
  providers: [NFRDataLogService],
})
export class NFRDataLogModule {}
