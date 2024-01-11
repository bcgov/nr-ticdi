import { FC } from "react";
import Collapsible from "../../../app/components/common/Collapsible";
import { DispositionTransactionResource } from "../../app/types/types";
import TenureDetails from "../../Components/TenureDetails";
import Button from "../../../app/components/common/Button";
import AreaDetails from "../../Components/AreaDetails";

interface IndexPageProps {
  data: DispositionTransactionResource;
}

const IndexPage: FC<DispositionTransactionResource> = ({ data }) => {
  let contactAgent: string = "";
  if (data) {
    contactAgent = [
      data.contactFirstName,
      data.contactMiddleName,
      data.contactLastName,
    ]
      .filter(Boolean)
      .join(" ");
  }

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
          <div className="container mx-auto">
            <div className="grid grid-cols-3 gap-1">
              <div className="pt-2 pb-2">
                <div className="font-semibold">Contact/Agent Name</div>
                <div className="mt-1">{contactAgent}</div>
              </div>
              <div className="pb-2">
                <div className="font-semibold">Organization Unit</div>
                <div className="mt-1" id="orgUnit">
                  {data.orgUnit}
                </div>
              </div>
              <div className="pb-2">
                <div className="font-semibold">
                  Primary Contact Email Address
                </div>
                <div className="mt-1">{data.contactEmail}</div>
              </div>
              <div className="pb-2">
                <div className="font-semibold">
                  Primary Contact Phone Number
                </div>
                <div className="mt-1" id="phoneNumber">
                  {data.phone_number}
                </div>
              </div>
              <div className="pb-2">
                <div className="font-semibold">Contact/Agent Email Address</div>
                <div className="mt-1">{data.contact_email_address}</div>
              </div>
              <div className="pb-2">
                <div className="font-semibold">Contact/Agent Phone Number</div>
                <div className="mt-1" id="phoneNumber2">
                  {data.contact_phone_number}
                </div>
              </div>
              <div className="pb-2">
                <div className="font-semibold">Incorporation Number</div>
                <div className="mt-1">{data.incorporation_number}</div>
              </div>
              <div className="pb-2">
                <div className="font-semibold">Inspected Date</div>
                <div className="mt-1">{data.inspected_date}</div>
              </div>
            </div>
          </div>
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
};

export default IndexPage;
