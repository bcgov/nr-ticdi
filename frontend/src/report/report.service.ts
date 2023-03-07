import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
const axios = require("axios");

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class ReportService {
  constructor(private readonly httpService: HttpService) {
    hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
  }

  async getNFRProvisionsByVariant(
    variantName: string,
    nfrId: number
  ): Promise<any> {
    const returnItems = [
      "type",
      "provision_text",
      "free_text",
      "category",
      "provision_group",
      "id",
    ];
    const url = `${hostname}:${port}/nfr-provision/variant/${variantName}`;
    const nfrProvisions = await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));
    const reduced = nfrProvisions.map((obj) =>
      Object.keys(obj)
        .filter((key) => returnItems.includes(key))
        .reduce(
          (acc, key) => {
            acc[key] = obj[key];
            return acc;
          },
          { select: false }
        )
    );
    if (nfrId != -1) {
      const nfrDataUrl = `${hostname}:${port}/nfr-data/${nfrId}`;
      const nfrData = await axios
        .get(nfrDataUrl)
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err.response.data));
      reduced.map((obj) => {
        if (nfrData.enabled_provisions.includes(obj.id)) {
          obj.select = true;
        }
        return obj;
      });
    }
    return reduced.map((obj) => {
      const groupObj = obj.provision_group;
      delete obj["provision_group"];
      obj["max"] = groupObj.max;
      obj["provision_group"] = groupObj.provision_group;
      return obj;
    });
  }

  async getGroupMaxByVariant(variantName: string): Promise<any> {
    const url = `${hostname}:${port}/nfr-provision/get-group-max/variant/${variantName}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getEnabledProvisions(nfrDataId: number) {
    const url = `${hostname}:${port}/nfr-data/get-enabled-provisions/${nfrDataId}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getNfrData(nfrDataId: number): Promise<any> {
    const url = `${hostname}:${port}/nfr-data/${nfrDataId}`;
    const data = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
    return data;
  }

  async saveNFR(
    dtid: number,
    variant_name: string,
    status: string,
    enabled_provisions: number[],
    idir_username: string
  ) {
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/${encodeURI(
      "Notice of Final Review"
    )}`;
    const documentTemplate = await axios.get(templateUrl).then((res) => {
      return res.data;
    });
    const url = `${hostname}:${port}/nfr-data`;
    const data = {
      dtid: dtid,
      variant_name: variant_name,
      template_id: documentTemplate.id,
      status: status,
      enabled_provisions: enabled_provisions,
      create_userid: idir_username,
      ttls_data: [],
    };
    await axios
      .post(url, {
        body: data,
      })
      .then((res) => {
        return res.data;
      });
  }
}
