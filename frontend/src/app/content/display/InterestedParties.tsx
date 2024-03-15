import { FC } from 'react';
import { DTRDisplayObject } from '../../../app/types/types';
import DataSection from '../../components/common/DataSection';

interface InterestedPartiesProps {
  data: DTRDisplayObject;
}

const InterestedParties: FC<InterestedPartiesProps> = ({ data }) => {
  if (!data) {
    return <div className="ml-2 mb-3 mt-3">No interested parties available.</div>;
  }
  return (
    <>
      <div className="ml-2 mb-3 mt-3">
        {data.interestedParties.map((item, index) => (
          <div key={index} className="form-row">
            <div className="col-md-5 form-group">
              <div className="font-weight-bold">Client Name</div>
              <DataSection content={item.clientName} />
            </div>
            <div className="col-md-5 form-group">
              <div className="font-weight-bold">Address</div>
              <DataSection content={item.address} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InterestedParties;
