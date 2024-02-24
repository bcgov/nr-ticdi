import { FC } from 'react';
import { DTRDisplayObject } from '../../../app/types/types';
import DataSection from '../../components/common/DataSection';

interface AreaDetailsProps {
  data: DTRDisplayObject;
}

const AreaDetails: FC<AreaDetailsProps> = ({ data }) => {
  if (!data) {
    return <div className="ml-2 mb-3 mt-3">No area details available.</div>;
  }
  return (
    <div className="ml-2 mb-3 mt-3">
      {data.areaList.map((item, index) => (
        <div className="form-row">
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Area</div>
            <DataSection content={item.areaInHectares} id={`areaHa${index}`} />
          </div>
          <div className="col-md-5 form-group">
            <div className="font-weight-bold">Legal Description</div>
            <DataSection content={data.orgUnit} id={`legalDescription${index}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AreaDetails;
