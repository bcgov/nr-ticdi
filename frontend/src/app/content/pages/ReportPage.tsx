import { FC, useState } from "react";
import Collapsible from "../../../app/components/common/Collapsible";
import { DTRDisplayObject } from "../../../app/types/types";
import TenureDetails from "../display/TenureDetails";
import Button from "../../../app/components/common/Button";
import AreaDetails from "../display/AreaDetails";
import DtidDetails from "../display/DtidDetails";
import { generateReport } from "../../common/report";
import VariantDropdown from "../../components/common/VariantDropdown";
import {
  CURRENT_REPORT_PAGES,
  NFR_REPORT_PAGES,
  PAGE,
} from "../../util/constants";
import InterestedParties from "../display/InterestedParties";

export interface ReportPageProps {
  data: DTRDisplayObject;
  documentDescription: string;
}

const ReportPage: FC<ReportPageProps> = ({ data, documentDescription }) => {
  const [dtid] = useState(data.dtid);

  const generateReportHandler = () => {
    generateReport(dtid, data.fileNum, documentDescription);
  };

  return (
    <>
      <div className="h1">Preview - {documentDescription} (Draft)</div>
      <hr />
      {Object.values(NFR_REPORT_PAGES).includes(documentDescription) && (
        <div>
          <VariantDropdown values={NFR_REPORT_PAGES} />
          <hr />
        </div>
      )}
      <div className="mb-3 mt-3">
        <div className="font-weight-bold inlineDiv mr-1">DTID:</div>
        <div className="inlineDiv" id="dtid">
          {data.dtid}
        </div>
      </div>
      <div className="mb-3">
        <div className="font-weight-bold inlineDiv mr-1">
          Tenure File Number:
        </div>
        <div className="inlineDiv" id="tfn">
          {data.fileNum}
        </div>
      </div>
      <div className="mb-3">
        <div className="font-weight-bold inlineDiv mr-1">
          Primary Contact Name:
        </div>
        <div className="inlineDiv">{data.primaryContactName}</div>
      </div>
      <Collapsible title="Disposition Transaction ID Details">
        <DtidDetails data={data} />
      </Collapsible>
      <Collapsible title="Tenure Details">
        <TenureDetails data={data} />
      </Collapsible>
      {documentDescription === CURRENT_REPORT_PAGES.LUR ||
      documentDescription === PAGE.INDEX ? (
        <Collapsible title="Area">
          <AreaDetails data={data} />
        </Collapsible>
      ) : (
        <Collapsible title="Interested Parties">
          <InterestedParties data={data} />
        </Collapsible>
      )}

      <Button text="Create" onClick={generateReportHandler} />
    </>
  );
};

export default ReportPage;
