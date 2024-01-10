import React from "react";
import Collapsible from "../../../UI/Collapsible/Collapsible";
import DtidDetails from "../../Components/DtidDetails";
import TenureDetails from "../../Components/TenureDetails";
import Button from "../../../UI/Collapsible/Button";
import AreaDetails from "../../Components/AreaDetails";

function IndexPage({ data }) {
  return (
    <>
      <div className="container">
        <div className="h1">Preview - Land Use Report (Draft)</div>
        <hr />

        <div className="m-3">
          <div className="font-weight-bold inlineDiv">DTID:</div>{" "}
          <div className="inlineDiv" id="dtid">
            {data.dtid}
          </div>
        </div>
        <div className="m-3">
          <div className="font-weight-bold inlineDiv">Tenure File Number:</div>{" "}
          <div className="inlineDiv" id="tfn">
            {data.tenure_file_number}
          </div>
        </div>
        <div className="m-3">
          <div className="font-weight-bold inlineDiv">
            Primary Contact Name:
          </div>{" "}
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
        <Button text="Create" onClick={null} />
      </div>
    </>
  );
}

export default IndexPage;
