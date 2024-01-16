import { FC } from "react";
import { DTRDisplayObject } from "../../../app/types/types";
import DataSection from "../../components/common/DataSection";

interface DtidDetailsProps {
  data: DTRDisplayObject;
}

const DtidDetails: FC<DtidDetailsProps> = ({ data }) => {
  return (
    <div className="ml-2 mb-3 mt-3">
      <div className="form-row">
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Contact/Agent Name</div>
          <DataSection content={data.contactName} id="contactName" />
        </div>
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Organization Unit</div>
          <DataSection content={data.orgUnit} id="orgUnit" />
        </div>
      </div>
      <div className="form-row">
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Primary Contact Email Address</div>
          <DataSection
            content={data.primaryContactEmail}
            id="primaryContactEmail"
          />
        </div>
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Primary Contact Phone Number</div>
          <DataSection
            content={data.primaryContactPhone}
            id="primaryContactPhoneNumber"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Contact/Agent Email Address</div>
          <DataSection content={data.contactEmail} id="contactEmail" />
        </div>
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Contact/Agent Phone Number</div>
          <DataSection
            content={data.contactPhoneNumber}
            id="contactPhoneNumber"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Incorporation Number</div>
          <DataSection content={data.incorporationNum} id="incorporationNum" />
        </div>
        <div className="col-md-5 form-group">
          <div className="font-weight-bold">Inspected Date</div>
          <DataSection content={data.inspectionDate} id="inspectionDate" />
        </div>
      </div>
    </div>
  );
};

export default DtidDetails;
