import React from "react";

function AreaDetails({ data }) {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-1">
        {data.tenure.map((item, index) => (
          <div key={index} className="pt-2 pb-2">
            <div className="font-semibold">Area</div>
            <div className="mt-1">{item.area}</div>

            <div className="pb-2">
              <div className="font-semibold">Legal Description</div>
              <div className="mt-1" id="orgUnit">
                {item.legal_description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AreaDetails;
