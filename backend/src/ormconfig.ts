import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PrintRequestDetail } from './print_request_detail/entities/print_request_detail.entity';
import { PrintRequestLog } from './print_request_log/entities/print_request_log.entity';
import { DocumentTemplate } from './document_template/entities/document_template.entity';
import { PrintRequestDetailView } from './print_request_detail/entities/print_request_detail_vw';
import { NFRData } from './nfr_data/entities/nfr_data.entity';
import { NFRDataLog } from './nfr_data_log/entities/nfr_data_log.entity';
import { NFRProvision } from './nfr_provision/entities/nfr_provision.entity';
import { NFRProvisionGroup } from './nfr_provision/entities/nfr_provision_group.entity';
import { NFRProvisionVariable } from './nfr_provision/entities/nfr_provision_variable.entity';
import { NFRProvisionVariant } from './nfr_provision/entities/nfr_provision_variant.entity';
import { NFRDataProvision } from './nfr_data/entities/nfr_data_provision.entity';
import { NFRDataVariable } from './nfr_data/entities/nfr_data_variable.entity';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST || 'localhost',
  port: 5432,
  database: process.env.POSTGRESQL_DATABASE || 'postgres',
  username: process.env.POSTGRESQL_USER || 'postgres',
  password: process.env.POSTGRESQL_PASSWORD,
  entities: [
    PrintRequestDetail,
    PrintRequestLog,
    NFRData,
    NFRDataProvision,
    NFRDataVariable,
    NFRDataLog,
    NFRProvision,
    NFRProvisionGroup,
    NFRProvisionVariable,
    NFRProvisionVariant,
    DocumentTemplate,
    PrintRequestDetailView,
  ],
  synchronize: false,
};

export default config;
