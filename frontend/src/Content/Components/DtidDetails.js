import React from "react";

function DtidDetails({ data }) {
  return (
    // <div>
    //   <div class="form-row">
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Contact/Agent Name</dt>
    //       <dd>{data.contact_agent}</dd>
    //     </div>
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Organization Unit</dt>
    //       <dd id="orgUnit">{data.organization_unit}</dd>
    //     </div>
    //   </div>
    //   <div class="form-row">
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Primary Contact Email Address</dt>
    //       <dd>{data.email_address}</dd>
    //     </div>
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Primary Contact Phone Number</dt>
    //       <dd id="phoneNumber">{data.phone_number}</dd>
    //     </div>
    //   </div>
    //   <div class="form-row">
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Contact/Agent Email Address</dt>
    //       <dd>{data.contact_email_address}</dd>
    //     </div>
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Contact/Agent Phone Number</dt>
    //       <dd id="phoneNumber2">{data.contact_phone_number}</dd>
    //     </div>
    //   </div>
    //   <div class="form-row">
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Incorporation Number</dt>
    //       <dd>{data.incorporation_number}</dd>
    //     </div>
    //     <div class="form-group col-md-5 dataSection dataSection">
    //       <dt>Inspected Date</dt>
    //       <dd>{data.inspected_date}</dd>
    //     </div>
    //   </div>
    // </div>
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-1">
        <div className="pt-2 pb-2 width-5/12">
          <div className="font-semibold">Contact/Agent Name</div>
          <div className="mt-1">{data.contact_agent}</div>
        </div>
        <div className="pb-2 width-5/12">
          <div className="font-semibold">Organization Unit</div>
          <div className="mt-1" id="orgUnit">
            {data.organization_unit}
          </div>
        </div>
        <div className="pb-2 width-5/12">
          <div className="font-semibold">Primary Contact Email Address</div>
          <div className="mt-1">{data.email_address}</div>
        </div>
        <div className="pb-2 width-5/12">
          <div className="font-semibold">Primary Contact Phone Number</div>
          <div className="mt-1" id="phoneNumber">
            {data.phone_number}
          </div>
        </div>
        <div className="pb-2 width-5/12">
          <div className="font-semibold">Contact/Agent Email Address</div>
          <div className="mt-1">{data.contact_email_address}</div>
        </div>
        <div className="pb-2 width-5/12">
          <div className="font-semibold">Contact/Agent Phone Number</div>
          <div className="mt-1" id="phoneNumber2">
            {data.contact_phone_number}
          </div>
        </div>
        <div className="pb-2 width-5/12">
          <div className="font-semibold">Incorporation Number</div>
          <div className="mt-1">{data.incorporation_number}</div>
        </div>
        <div className="pb-2 width-5/12">
          <div className="font-semibold">Inspected Date</div>
          <div className="mt-1">{data.inspected_date}</div>
        </div>
      </div>
    </div>
  );
}

export default DtidDetails;
