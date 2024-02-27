import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintRequestDetail } from './entities/print_request_detail.entity';
import { PrintRequestDetailController } from './print_request_detail.controller';
import { PrintRequestDetailService } from './print_request_detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrintRequestDetail])],
  controllers: [PrintRequestDetailController],
  providers: [PrintRequestDetailService],
})
export class PrintRequestDetailModule {}
