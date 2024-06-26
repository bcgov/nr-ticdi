import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DocumentData } from './document_data/entities/document_data.entity';
import { DocumentDataProvision } from './document_data/entities/document_data_provision.entity';
import { DocumentDataVariable } from './document_data/entities/document_data_variable.entity';
import { DocumentDataLog } from './document_data_log/entities/document_data_log.entity';
import { DocumentTemplate } from './document_template/entities/document_template.entity';
import { DocumentType } from './document_type/entities/document_type.entity';
import { Provision } from './provision/entities/provision.entity';
import { ProvisionGroup } from './document_type/entities/provision_group.entity';
import { ProvisionVariable } from './provision/entities/provision_variable.entity';
import { DocumentTypeProvision } from './provision/entities/document_type_provision';

const config: TypeOrmModuleOptions = {
  logging: ['error'],
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DATABASE || 'postgres',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  entities: [
    DocumentData,
    DocumentDataProvision,
    DocumentDataVariable,
    DocumentDataLog,
    Provision,
    ProvisionGroup,
    ProvisionVariable,
    DocumentTemplate,
    DocumentType,
    DocumentTypeProvision,
  ],
  synchronize: false,
};

export default config;
