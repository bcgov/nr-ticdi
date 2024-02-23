import { FC } from 'react';
import { DTRDisplayObject } from '../../../app/types/types';

interface InterestedPartiesProps {
  data: DTRDisplayObject;
}

// TODO
const InterestedParties: FC<InterestedPartiesProps> = ({ data }) => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-1">
        {data.areaList.map((item, index) => (
          <div key={index} className="pt-2 pb-2">
            <div className="font-semibold">Client Name</div>
            <div className="mt-1">{item.areaInHectares}</div>

            <div className="pb-2">
              <div className="font-semibold">Address</div>
              <div className="mt-1">{item.legalDescription}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestedParties;
