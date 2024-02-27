import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  async initializeDb() {
    const queryRunner = this.dataSource.createQueryRunner();
    // Check if there are already provisions/groups/variants in the db
    const [provisionCount] = await queryRunner.query('SELECT COUNT(*) FROM nfr_provision');
    const [groupCount] = await queryRunner.query('SELECT COUNT(*) FROM nfr_provision_group');
    const [variantCount] = await queryRunner.query('SELECT COUNT(*) FROM nfr_provision_variant');
    // If there is no data in any of the tables, run the SQL script
    if (provisionCount.count == 0 && groupCount.count == 0 && variantCount.count == 0) {
      //const sql = fs.readFileSync("./utils/db/init-db.sql", "utf8");
      //await queryRunner.query(sql);
      //await queryRunner.release();
    }
  }

  getHello(): string {
    return 'Hello Backend!';
  }
}
