import { FC } from "react";
import Collapsible from "../../../app/components/common/Collapsible";
import { DTRDisplayObject } from "../../../app/types/types";
import TenureDetails from "../display/TenureDetails";
import Button from "../../../app/components/common/Button";
import AreaDetails from "../display/AreaDetails";
import DtidDetails from "../display/DtidDetails";

export interface IndexPageProps {
  data: DTRDisplayObject;
}

const IndexPage: FC<IndexPageProps> = ({ data }) => {
  return (
    <>
      <div className="h1">Preview - Land Use Report (Draft)</div>
      <hr />

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
      <Collapsible title="Area">
        <AreaDetails data={data} />
      </Collapsible>
      <Button text="Create" onClick={() => {}} />
    </>
  );
};

export default IndexPage;
