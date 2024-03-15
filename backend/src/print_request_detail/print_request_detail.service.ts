import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePrintRequestDetailDto } from './dto/create-print_request_detail.dto';
import { PrintRequestDetail } from './entities/print_request_detail.entity';
import { PrintRequestDetailView } from './entities/print_request_detail_vw';

@Injectable()
export class PrintRequestDetailService {
  constructor(
    @InjectRepository(PrintRequestDetail)
    private printRequestDetailRepository: Repository<PrintRequestDetail>,
    private dataSource: DataSource
  ) {}

  async create(printRequestDetail: CreatePrintRequestDetailDto): Promise<PrintRequestDetail> {
    const newItem = new PrintRequestDetail();
    newItem.dtid = printRequestDetail.dtid;
    newItem.tenure_file_number = printRequestDetail.tenure_file_number;
    newItem.incorporation_number = printRequestDetail.incorporation_number;
    newItem.organization_unit = printRequestDetail.organization_unit;
    newItem.purpose_name = printRequestDetail.purpose_name;
    newItem.sub_purpose_name = printRequestDetail.sub_purpose_name;
    newItem.type_name = printRequestDetail.type_name;
    newItem.sub_type_name = printRequestDetail.sub_type_name;
    newItem.first_name = printRequestDetail.first_name;
    newItem.middle_name = printRequestDetail.middle_name;
    newItem.last_name = printRequestDetail.last_name;
    newItem.legal_name = printRequestDetail.legal_name;
    newItem.licence_holder_name = printRequestDetail.licence_holder_name;
    newItem.contact_agent = printRequestDetail.contact_agent;
    newItem.contact_company_name = printRequestDetail.contact_company_name;
    newItem.contact_first_name = printRequestDetail.contact_first_name;
    newItem.contact_middle_name = printRequestDetail.contact_middle_name;
    newItem.contact_last_name = printRequestDetail.contact_last_name;
    newItem.contact_phone_number = printRequestDetail.contact_phone_number;
    newItem.contact_email_address = printRequestDetail.contact_email_address;
    newItem.email_address = printRequestDetail.email_address;
    newItem.phone_number = printRequestDetail.phone_number;
    newItem.inspected_date = printRequestDetail.inspected_date;
    newItem.mailing_address = printRequestDetail.mailing_address;
    newItem.mailing_address_line_1 = printRequestDetail.mailing_address_line_1;
    newItem.mailing_address_line_2 = printRequestDetail.mailing_address_line_2;
    newItem.mailing_address_line_3 = printRequestDetail.mailing_address_line_3;
    newItem.mailing_city = printRequestDetail.mailing_city;
    newItem.mailing_province_state_code = printRequestDetail.mailing_province_state_code;
    newItem.mailing_postal_code = printRequestDetail.mailing_postal_code;
    newItem.mailing_zip = printRequestDetail.mailing_zip;
    newItem.mailing_country_code = printRequestDetail.mailing_country_code;
    newItem.mailing_country = printRequestDetail.mailing_country;
    newItem.location_description = printRequestDetail.location_description;
    newItem.tenure = printRequestDetail.tenure;
    newItem.create_userid = printRequestDetail.create_userid;

    const newPRD = this.printRequestDetailRepository.create(newItem);
    return this.convertTenureToJson(await this.printRequestDetailRepository.save(newPRD));
  }

  async findAll(): Promise<PrintRequestDetail[]> {
    return this.convertTenureToJson(await this.printRequestDetailRepository.find());
  }

  async findByDtid(dtid: number): Promise<PrintRequestDetail[]> {
    try {
      const prd = await this.printRequestDetailRepository.find({
        where: {
          dtid: dtid,
        },
      });
      return this.convertTenureToJson(prd);
    } catch (err) {
      console.log(err);
    }
  }

  async findViewByPRDID(prdid: number): Promise<PrintRequestDetailView> {
    let view = await this.dataSource.manager.findOneBy(PrintRequestDetailView, {
      PRDID: prdid,
    });
    return this.convertTenureToJson(view);
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.printRequestDetailRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  // converts the tenure/Tenure from a json string to a json object before returning
  convertTenureToJson(prd: any) {
    let p;
    if (Array.isArray(prd)) {
      if (prd[0].tenure) {
        prd = prd.map(function (entry) {
          if (entry.tenure) {
            p = JSON.parse(entry.tenure);
            entry['tenure'] = p;
            return entry;
          }
        });
        return prd;
      } else if (prd[0].Tenure) {
        prd = prd.map(function (entry) {
          if (entry.Tenure) {
            p = JSON.parse(entry.Tenure);
            entry['Tenure'] = p;
            return entry;
          }
        });
        return prd;
      }
    } else {
      if (prd.tenure) {
        p = JSON.parse(prd.tenure);
        prd['tenure'] = p;
        return prd;
      } else if (prd.Tenure) {
        p = JSON.parse(prd.Tenure);
        prd['Tenure'] = p;
        return prd;
      }
    }
  }
}
