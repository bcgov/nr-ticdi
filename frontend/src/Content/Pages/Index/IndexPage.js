import React from "react";
import Collapsible from "../../../UI/Collapsible/Collapsible";
import DtidDetails from "../../Components/DtidDetails";

function IndexPage({ data }) {
  return (
    <>
      <div class="container">
        <h1 className="text-4xl font-bold pt-4">
          Preview - Land Use Report (Draft)
        </h1>
        <hr className="border-t border-gray-800 my-4" />

        <div className="m-2">
          <div className="text-lg font-bold">DTID:</div>{" "}
          <div id="dtid">{data.dtid}</div>
        </div>
        <div className="m-2">
          <div className="text-lg font-bold">Tenure File Number:</div>{" "}
          <div className="text-lg" id="tfn">
            {data.tenure_file_number}
          </div>
        </div>
        <div className="m-2">
          <div className="text-lg font-bold">Primary Contact Name:</div>{" "}
          <div className="text-lg">{data.primaryContactName}</div>
        </div>

        <Collapsible title="Disposition Transaction ID Details">
          <DtidDetails data={data} />
        </Collapsible>
        {/* <fieldset class="form-group collapsible">
                <legend style="cursor: pointer" class='togvis sectionTitle'><i class="fa fa-plus"></i>  Tenure Details</legend>
                <div class="contents" style="display: none;">
                    <div class="form-row">
                        <div class="form-group col-md-5 dataSection">
                            <dt>Type</dt>
                            <dd id="type">{ message.type_name }</dd>
                        </div>
                        <div class="form-group col-md-5 dataSection">
                            <dt>Subtype</dt>
                            <dd id="subType">{message.sub_type_name}</dd>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-5 dataSection">
                            <dt>Purpose</dt>
                            <dd id="purpose">{ message.purpose_name }</dd>
                        </div>
                        <div class="form-group col-md-5 dataSection">
                            <dt>Subpurpose</dt>
                            <dd id="subPurpose">{message.sub_purpose_name}</dd>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-5 dataSection">
                            <dt>Mailing Address</dt>
                            <dd id="address">{message.mailing_address}</dd>
                            <dd id="cityProvPostal">{message.cityProvPostal}</dd>
                            <dd id="postalCode">{message.mailing_country}</dd>
                        </div>
                        <div class="form-group col-md-5 dataSection">
                            <dt>Location of Land</dt>
                            <dd id="locLand">{message.location_description}</dd>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset class="form-group collapsible">
                <legend style="cursor: pointer" class='togvis sectionTitle'><i class="fa fa-plus"></i>  Area</legend>
                <div class="contents" style="display: none;">
                    {#each message.tenure}
                    <div class="form-row">
                        <div class="form-group col-md-2 dataSection">
                            <dt>Area</dt>
                            <dd id="area">{ this.Area }</dd>
                        </div>
                        <div class="form-group col-md-10">
                            <dt>Legal Description</dt>
                            <dd class="legalDesc" title="{this.LegalDescription}">{this.LegalDescription}</dd>
                        </div>
                    </div>
                    {/each}
                </div>
            </fieldset> */}
        {/* <div class="form-group row">
          <div class="col-md-4">
            <button
              type="button"
              class="btn btn-primary"
              onclick="generateReport('LUR')"
              id="genReport"
            >
              Create
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default IndexPage;
