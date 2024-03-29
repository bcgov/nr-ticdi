import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './content/display/Header';
import Footer from './content/display/Footer';
import SearchPage from './content/pages/SearchPage';
import ManageTemplatesPage from './content/pages/ManageTemplatesPage';
import AdminPage from './content/pages/AdminPage';
import ContentWrapper from './content/ContentWrapper';
import SystemAdministration from './content/pages/SystemAdministration';
import ManageProvisionsPage from './content/pages/ManageProvisionsPage';
import ManageDocumentsPage from './content/pages/ManageDocumentsPage';
import LandingPage from './content/pages/LandingPage';
import { Provider } from 'react-redux';
import store from './store/store';

const App: FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header idirUsername="Michael" isAdmin={true} />
        <Routes>
          <Route
            path={`/`}
            element={
              <ContentWrapper>
                <LandingPage />
              </ContentWrapper>
            }
          />
          <Route
            path={`/search`}
            element={
              <ContentWrapper>
                <SearchPage />
              </ContentWrapper>
            }
          />
          ;
          <Route
            path={`/system-admin`}
            element={
              <ContentWrapper>
                <SystemAdministration />
              </ContentWrapper>
            }
          />
          <Route
            path={`/manage-admins`}
            element={
              <ContentWrapper>
                <AdminPage />
              </ContentWrapper>
            }
          />
          <Route
            path={`/manage-doc-types`}
            element={
              <ContentWrapper>
                <ManageDocumentsPage />
              </ContentWrapper>
            }
          />
          <Route
            path={`/manage-templates`}
            element={
              <ContentWrapper>
                <ManageTemplatesPage />
              </ContentWrapper>
            }
          />
          <Route
            path={`/manage-provisions`}
            element={
              <ContentWrapper>
                <ManageProvisionsPage />
              </ContentWrapper>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
