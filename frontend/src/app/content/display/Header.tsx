import { FC } from 'react';
import Roles from '../../../app/roles';
import UserService from '../../service/user-service';

const Header: FC = () => {
  const username = UserService.getUsername();
  const isAdmin = UserService.hasRole([Roles.TICDI_ADMIN]);

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <a className="navbar-brand" href="https://www2.gov.bc.ca">
            <img
              className="img-fluid d-none d-md-block"
              src="/images/bcid-logo-rev-en.svg"
              width="181"
              height="44"
              alt="B.C. Government Logo"
            />
            <img
              className="img-fluid d-md-none"
              src="/images/bcid-symbol-rev.svg"
              width="64"
              height="44"
              alt="B.C. Government Logo"
            />
          </a>
          <div className="navbar-brand">TICDI</div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup" style={{ width: 'auto' }}>
            <div className="navbar-nav" style={{ width: 'auto' }}>
              {isAdmin && (
                <div id="adminLinkDiv" style={{ width: 'auto' }}>
                  <a className="nav-item nav-link" id="adminLink" href="/system-admin">
                    Administration
                  </a>
                </div>
              )}
              <div id="searchLinkDiv" style={{ width: 'auto' }}>
                <a className="nav-item nav-link" id="searchLink" href="/search">
                  Search
                </a>
              </div>
              <div id="createDocumentLinkDiv" style={{ width: 'auto' }}>
                <a className="nav-item nav-link" id="createDocumentLink" href="/">
                  Create Document
                </a>
              </div>
            </div>
          </div>
          <div style={{ float: 'right', color: 'white' }}>{username}</div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
