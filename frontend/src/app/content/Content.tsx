import { FC } from 'react';
import ReportPage from './pages/ReportPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import ManageTemplatesPage from './pages/ManageTemplatesPage';
import { CURRENT_REPORT_PAGES } from '../util/constants';

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
              </div>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
};

export default Content;
