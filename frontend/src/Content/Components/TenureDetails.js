import React from "react";

function TenureDetails({ data }) {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-1">
        <div className="pt-2 pb-2">
          <div className="font-semibold">Type</div>
          <div className="mt-1" id="type">
            {data.type_name}
          </div>
        </div>
        <div className="pb-2">
          <div className="font-semibold">Subtype</div>
          <div className="mt-1" id="subtype">
            {data.sub_type_name}
          </div>
        </div>
        <div className="pb-2">
          <div className="font-semibold">Purpose</div>
          <div className="mt-1" id="purpose">
            {data.purpose_name}
          </div>
        </div>
        <div className="pb-2">
          <div className="font-semibold">Subpurpose</div>
          <div className="mt-1" id="subpurpose">
            {data.sub_purpose_name}
          </div>
        </div>
        <div className="pb-2">
          <div className="font-semibold">Mailing Address</div>
          <div className="mt-1">{data.mailing_address}</div>
          <div className="mt-1">{data.city_prov_postal}</div>
          <div className="mt-1">{data.mailing_country}</div>
        </div>
        <div className="pb-2">
          <div className="font-semibold">Location of Land</div>
          <div className="mt-1" id="phoneNumber2">
            {data.location_description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenureDetails;
