import { FC, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './content/display/Header';
import Footer from './content/display/Footer';
import { getDocumentTypes } from './common/report';
import { DocumentType } from './types/types';
import ReportPage from './content/pages/ReportPage';
import SearchPage from './content/pages/SearchPage';
import ManageTemplatesPage from './content/pages/ManageTemplatesPage';
import AdminPage from './content/pages/AdminPage';
import ContentWrapper from './content/ContentWrapper';

const App: FC = () => {
  // used to render report pages
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  useEffect(() => {
    const getDocTypes = async () => {
      const docTypes = await getDocumentTypes();
      setDocumentTypes(docTypes || []);
    };
    getDocTypes();
  }, []);

  return (
    <Router>
      <Header idirUsername="Michael" isAdmin={true} />
      <Routes>
        <Route
          path={`/manage-templates/:id`}
          element={
            <ContentWrapper>
              <ManageTemplatesPage />
            </ContentWrapper>
          }
        />
        ;
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
              <AdminPage />
            </ContentWrapper>
          }
        />
        ;
        {documentTypes.map((docType) => (
          <Route
            key={docType.id}
            path={`/dtid/:dtid/${docType.name}`} // may need to use hardcoded paths for certain reports, grazing lease has a weird url
            element={
              <ContentWrapper>
                <ReportPage documentType={docType} />
              </ContentWrapper>
            }
          />
        ))}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
