import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Alert,
  Container,
  Spinner,
  Table,
  Row,
  Col,
  Button,
  ButtonGroup,
} from "react-bootstrap";

import Api, { ApiError } from "../../utilities/api.ts";
import {
  REQUEST_STATUS,
  CREATE_LICENSES_PATHNAME,
  LICENSES_PATHNAME,
  SYSTEM_ROLES,
} from "../../utilities/constants";

import {
  formatDateString,
  formatListShorten,
} from "../../utilities/formatting.ts";

import RenderOnRole from "../../components/RenderOnRole";
import LinkButton from "../../components/LinkButton";
import PageHeading from "../../components/PageHeading";
import HorizontalField from "../../components/HorizontalField";
import VerticalField from "../../components/VerticalField";
import SectionHeading from "../../components/SectionHeading";
import CustomCheckBox from "../../components/CustomCheckBox";

import {
  fetchLicenceResults,
  selectLicenceResults,
  setLicenceSearchPage,
  fetchTTLSResults
} from "./searchSlice";


function formatResultRow(result) {
  const url = `${LICENSES_PATHNAME}/${result.licenceId}`;
  return (
    <tr key={result.licenceId}>
      <td className="text-nowrap">
        <Link to={url}>{result.licenceNumber}</Link>
      </td>
      <td className="text-nowrap">{result.licenceType}</td>
      <td className="text-nowrap">{formatListShorten(result.lastNames)}</td>
      <td className="text-nowrap">{formatListShorten(result.companyNames)}</td>
      <td className="text-nowrap">{result.licenceStatus}</td>
      <td className="text-nowrap">{formatDateString(result.issuedOnDate)}</td>
      <td className="text-nowrap">{formatDateString(result.expiryDate)}</td>
      <td className="text-nowrap">{result.region}</td>
      <td className="text-nowrap">{result.regionalDistrict}</td>
    </tr>
  );
}

function navigateToSearchPage(dispatch, page) {
  dispatch(setLicenceSearchPage(page));
  // dispatch(fetchLicenceResults());
}

function wait(ms){
  const start = new Date().getTime();
  let end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}

export default function LicenceResultsPage() {
  
//   const results = fetchLicenceResults();
//   wait(2000);

  // eslint-disable-next-line
  // console.log(results);   

  // useEffect(() => {
  //  dispatch(fetchTTLSResults());
  // }, [dispatch]);

  let control = null;



  control = (

    <Container className="mt-3 mb-4">
        <Row>
          <HorizontalField
            label="DTID"
            value="921711"
          />
          <div className="w-100 d-xl-none" />
        </Row>
        <Row>
          <HorizontalField
            label="Name"
            value="TBD"
          />

          <div className="w-100 d-xl-none" />
        </Row>
        <Row>
          <HorizontalField
            label="Document Type"
            value="Land Use Report"
          />
          <div className="w-100 d-xl-none" />
        </Row>
        <SectionHeading>Disposition Transaction ID Details</SectionHeading>
        <Row>
          <Col>
          <VerticalField
            label="Contact or Agent Name"
            value="Billy Jean"
          />
          </Col>
          <Col>
          <VerticalField
            label="Email Address"
            value="billy@email.com"
          />
          </Col>
        </Row>
        <Row>
          <Col>
          <VerticalField
            label="Organization Unit"
            value="OM - LAND MGMNT - NORTHERN SERVICE REGION"
          />
          </Col>
          <Col>
          <VerticalField
            label="Inspected Date"
            value="2020-01-02"
          />
          </Col>
        </Row>
        <Row>
          <Col>
          <VerticalField
            label="Incorporation Number"
            value="1231223"
          />
          </Col>
          <Col>
          <VerticalField
            label="Inspected Date"
            value="2022-01-03"
          />
          </Col>
        </Row>
        <Row>
          <Col>
          <VerticalField
            label="Policy Name"
            value="TBD"
          />
          </Col>
          <Col>
          <VerticalField
            label="Purpose Statement"
            value="TBD"
          />
          </Col>
        </Row>
        <SectionHeading>Tenure Details</SectionHeading>
        <Row>
          <Col>
          <VerticalField
            label="File Number"
            value="7409801"
          />
          </Col>
          <Col>
          <VerticalField
            label="Address Mailing Tenant"
            value=""
          />
          </Col>
        </Row>
        <Row>
          <Col>
          <VerticalField
            label="Type"
            value="LICENCE"
          />
          </Col>
          <Col>
          <VerticalField
            label="Subtype"
            value="LICENCE OF OCCUPATION"
          />
          </Col>
        </Row>
        <Row>
          <Col>
          <VerticalField
            label="Purpose"
            value="QUARRYING"
          />
          </Col>
          <Col>
          <VerticalField
            label="Subpurpose"
            value="SAND AND GRAVEL"
          />
          </Col>
        </Row>
        <Row>
          <Col>
          <VerticalField
            label="Area"
            value="30"
          />
          </Col>
          <Col>
          <VerticalField
            label="Location Land"
            value="1km down Crocker FSR"
          />
          </Col>
        </Row>
        <Row>
          <Col>
        <VerticalField
            label="Legal Description"
            value="UNSURVEYED CROWN LAND IN THE VICINITY OF ANZAC RIVER AND COLBOURNE ROAD, CARIBOO DISTRICT."
          />
          </Col>
        </Row>
        <SectionHeading>Provision List</SectionHeading>
        <Row>
          <Col>
          <input type='text' value='TEMPLATE VARIABLES - LAND USE REPORT UPDATED' /><CustomCheckBox id="provision_list_cb_id"/>
          </Col>
        </Row>
        <Row>
          <Col>
          <input type='text' /><CustomCheckBox id="provision_list_cb_id2"/>
          </Col>
        </Row>
        <Row>
          <input type='submit' value='Create Document' />
        </Row>
      </Container>
  );

 

  return (
    <section>
      <PageHeading>Client</PageHeading>
      <Container>{control}</Container>
    </section>
  );
}
