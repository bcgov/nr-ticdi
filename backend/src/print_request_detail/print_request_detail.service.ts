import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreatePrintRequestDetailDto } from "./dto/create-print_request_detail.dto";
import { PrintRequestDetail } from "./entities/print_request_detail.entity";
import { PrintRequestDetailView } from "./entities/print_request_detail_vw";

@Injectable()
export class PrintRequestDetailService {
  constructor(
    @InjectRepository(PrintRequestDetail)
    private printRequestDetailRepository: Repository<PrintRequestDetail>,
    private dataSource: DataSource
  ) {}

  async create(
    printRequestDetail: CreatePrintRequestDetailDto
  ): Promise<PrintRequestDetail> {
    const newItem = new PrintRequestDetail();
    newItem.dtid = printRequestDetail.dtid;
    newItem.tenure_file_number = printRequestDetail.tenure_file_number;
    newItem.organization_unit = printRequestDetail.organization_unit;
    newItem.purpose_name = printRequestDetail.purpose_name;
    newItem.sub_purpose_name = printRequestDetail.sub_purpose_name;
    newItem.type_name = printRequestDetail.type_name;
    newItem.sub_type_name = printRequestDetail.sub_type_name;
    newItem.first_name = printRequestDetail.first_name;
    newItem.middle_name = printRequestDetail.middle_name;
    newItem.last_name = printRequestDetail.last_name;
    newItem.mailing_address_line_1 = printRequestDetail.mailing_address_line_1;
    newItem.mailing_address_line_2 = printRequestDetail.mailing_address_line_2;
    newItem.mailing_address_line_3 = printRequestDetail.mailing_address_line_3;
    newItem.mailing_city = printRequestDetail.mailing_city;
    newItem.mailing_province_state_code =
      printRequestDetail.mailing_province_state_code;
    newItem.mailing_postal_code = printRequestDetail.mailing_postal_code;
    newItem.mailing_zip = printRequestDetail.mailing_zip;
    newItem.mailing_country_code = printRequestDetail.mailing_country_code;
    newItem.mailing_country = printRequestDetail.mailing_country;
    newItem.location_description = printRequestDetail.location_description;
    newItem.parcels = printRequestDetail.parcels;
    newItem.create_userid = printRequestDetail.create_userid;
    let mailingAddress = "";
    if (printRequestDetail.mailing_address_line_1) {
      mailingAddress = printRequestDetail.mailing_address_line_1;
    }
    if (printRequestDetail.mailing_address_line_2) {
      mailingAddress = mailingAddress.concat(
        ", " + printRequestDetail.mailing_address_line_2
      );
    }
    if (printRequestDetail.mailing_address_line_3) {
      mailingAddress = mailingAddress.concat(
        ", " + printRequestDetail.mailing_address_line_3
      );
    }
    newItem.mailing_address = mailingAddress;
    let licenceHolderName = "";
    if (printRequestDetail.first_name) {
      licenceHolderName = printRequestDetail.first_name;
    }
    if (printRequestDetail.middle_name) {
      licenceHolderName = licenceHolderName.concat(
        " " + printRequestDetail.middle_name
      );
    }
    if (printRequestDetail.last_name) {
      licenceHolderName = licenceHolderName.concat(
        " " + printRequestDetail.last_name
      );
    }
    newItem.licence_holder_name = licenceHolderName;
    let area_ha_number = "";
    let legal_description = "";
    if (JSON.parse(printRequestDetail.parcels)[0]) {
      area_ha_number = JSON.parse(printRequestDetail.parcels)[0].area
        ? JSON.parse(printRequestDetail.parcels)[0].area.toString()
        : "";
      legal_description = JSON.parse(printRequestDetail.parcels)[0]
        .legal_description
        ? JSON.parse(printRequestDetail.parcels)[0].legal_description
        : "";
    }
    newItem.area_ha_number = area_ha_number;
    newItem.legal_description = legal_description;

    const newPRD = this.printRequestDetailRepository.create(newItem);
    return this.printRequestDetailRepository.save(newPRD);
  }

  async findAll(): Promise<PrintRequestDetail[]> {
    return this.convertParcelsToJson(
      await this.printRequestDetailRepository.find()
    );
  }

  async findByDtid(dtid: number): Promise<PrintRequestDetail[]> {
    try {
      const prd = await this.printRequestDetailRepository.find({
        where: {
          dtid: dtid,
        },
      });
      return this.convertParcelsToJson(prd);
    } catch (err) {
      console.log(err);
    }
  }

  async findViewByPRDID(prdid: number): Promise<PrintRequestDetailView> {
    const view = await this.dataSource.manager.findOneBy(
      PrintRequestDetailView,
      {
        PRDID: prdid,
      }
    );
    return view;
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.printRequestDetailRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  // converts the parcels/Parcels from a json string to a json object before returning
  convertParcelsToJson(prd: any) {
    let p;
    if (Array.isArray(prd)) {
      if (prd[0].parcels) {
        prd = prd.map(function (entry) {
          if (entry.parcels) {
            p = JSON.parse(entry.parcels);
            entry["parcels"] = p;
            return entry;
          }
        });
        return prd;
      } else if (prd[0].Parcels) {
        prd = prd.map(function (entry) {
          if (entry.Parcels) {
            p = JSON.parse(entry.Parcels);
            entry["Parcels"] = p;
            return entry;
          }
        });
        return prd;
      }
    } else {
      if (prd.parcels) {
        p = JSON.parse(prd.parcels);
        prd["parcels"] = p;
        return prd;
      } else if (prd.Parcels) {
        p = JSON.parse(prd.Parcels);
        prd["Parcels"] = p;
        return prd;
      }
    }
  }
}
