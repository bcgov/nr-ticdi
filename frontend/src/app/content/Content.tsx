import { FC } from 'react';
import ReportPage from './pages/ReportPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import ManageTemplatesPage from './pages/ManageTemplatesPage';
import { CURRENT_REPORT_PAGES } from '../util/constants';
import DocumentPreview from './pages/documentpreview/DocumentPreview';
import ManageTemplates from './pages/ManageTemplates';
import SystemAdministration from './pages/SystemAdministration';

interface ContentProps {
  pageTitle: string;
}

const Content: FC<ContentProps> = ({ pageTitle }) => {
  return (
    <div className="content-wrapper">
      <section className="content">
        <main role="main">
          <form>
            <div className="main">
              <div className="container">
                {Object.values(CURRENT_REPORT_PAGES).includes(pageTitle) && (
                  <ReportPage documentDescription={pageTitle} />
                )}

                {pageTitle === 'Search' && <SearchPage />}
                {pageTitle === 'System Administration' && <AdminPage />}
                {pageTitle === 'Manage Templates' && <ManageTemplatesPage />}
                {pageTitle === 'Document Preview' && <DocumentPreview />}
                {pageTitle === 'Select Manage Templates' && <ManageTemplates />}
                {pageTitle === 'System Administration Menu' && <SystemAdministration />}
              </div>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
};

export default Content;
