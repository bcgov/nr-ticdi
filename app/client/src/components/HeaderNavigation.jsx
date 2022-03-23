import React from "react";
import { useSelector } from "react-redux";
import { Container, Nav, Navbar } from "react-bootstrap";

import * as Constant from "../utilities/constants";

import DropdownNavLink from "./DropdownNavLink";
import HeaderDropdown from "./HeaderDropdown";

import "./HeaderNavigation.scss";

import RenderOnRole from "./RenderOnRole";

function HeaderNavigation() {
  const { environment } = useSelector((state) => state.status.data);

  let environmentClass = "";
  if (environment === "dev") {
    environmentClass = "env-dev";
  } else if (environment === "test") {
    environmentClass = "env-test";
  } else if (environment === "uat") {
    environmentClass = "env-uat";
  }

  return (
    <header>
      <Navbar expand="lg" id="main-menu" className={environmentClass}>
        <Container className="justify-content-start">
          <Navbar.Toggle aria-controls="main-menu-nav" />
          <Navbar.Collapse id="main-menu-nav">
            <Nav>
              <HeaderDropdown
                id="licenses-dropdown"
                title="Search"
                pathPrefix={Constant.LICENSES_PATHNAME}
              >
                <DropdownNavLink to={Constant.SEARCH_LICENSES_PATHNAME}>
                  Search by DTID
                </DropdownNavLink>
              </HeaderDropdown>

              <HeaderDropdown
                id="document-generation-dropdown"
                title="Document Generation"
                pathPrefix={Constant.DOCUMENT_GENERATION_PATHNAME}
              >
                  <DropdownNavLink to={Constant.SELECT_RENEWALS_PATHNAME}>
                    Renewals
                  </DropdownNavLink>
                  <DropdownNavLink
                    to={Constant.SELECT_RENEWALS_APIARY_PATHNAME}
                  >
                    Renewals - Apiary
                  </DropdownNavLink>
                  <DropdownNavLink to={Constant.SELECT_DAIRYNOTICES_PATHNAME}>
                    Dairy Infractions
                  </DropdownNavLink>
                  <DropdownNavLink
                    to={Constant.SELECT_DAIRYTANKNOTICES_PATHNAME}
                  >
                    Dairy Tank ReCheck Notices
                  </DropdownNavLink>
                <DropdownNavLink to={Constant.REPORTS_PATHNAME}>
                  Reports
                </DropdownNavLink>
                  <DropdownNavLink to={Constant.SELECT_CERTIFICATES_PATHNAME}>
                    Certificates
                  </DropdownNavLink>
              </HeaderDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default HeaderNavigation;
