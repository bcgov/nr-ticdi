import { FC } from 'react';
import { DTRDisplayObject } from '../../../app/types/types';
import DataSection from '../../components/common/DataSection';

interface TenureDetailsProps {
  data: DTRDisplayObject;
}

const TenureDetails: FC<TenureDetailsProps> = ({ data }) => {
  if (!data) {
    return <div className="ml-2 mb-3 mt-3">No tenure details available.</div>;
  }
  return (
    <>
      <div className="ml-2 mb-3 mt-3">
        <div className="form-row">
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Type</div>
            <DataSection content={data.type} id="type" />
          </div>
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Subtype</div>
            <DataSection content={data.subType} id="subType" />
          </div>
        </div>
        <div className="form-row">
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Purpose</div>
            <DataSection content={data.type} id="type" />
          </div>
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Subpurpose</div>
            <DataSection content={data.subPurpose} id="subPurpose" />
          </div>
        </div>
        <div className="form-row">
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Mailing Address</div>
            <DataSection content={data.mailingAddress1} id="mailingAddress1" />
            <DataSection content={data.mailingAddress2} id="mailingAddress2" />
            <DataSection content={data.mailingAddress3} id="mailingAddress3" />
          </div>
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Location of Land</div>
            <DataSection content={data.locLand} id="locLand" />
          </div>
        </div>
      </div>
    </>
  );
};

export default TenureDetails;
