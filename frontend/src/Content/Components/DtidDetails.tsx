import { FC } from "react";
import { DispositionTransactionResource } from "../../app/types/types";

interface DtidDetailsProps {
  data: DispositionTransactionResource;
}

const DtidDetails: FC<DtidDetailsProps> = ({ data }) => {
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
          <div className="font-semibold">Primary Contact Email Address</div>
          <div className="mt-1">{data.contactEmail}</div>
        </div>
        <div className="pb-2">
          <div className="font-semibold">Primary Contact Phone Number</div>
          <div className="mt-1" id="phoneNumber">
            {data.}
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
  );
};

export default DtidDetails;
