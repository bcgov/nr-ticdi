import { FC, useState } from "react";
import { rawData2 } from "../../app/constants/constants";
import { DTRDisplayObject } from "../types/types";
import { buildDTRDisplayData } from "../util/util";
import ReportPage from "./pages/ReportPage";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";
import { PAGE, CURRENT_REPORT_PAGES } from "../util/constants";

interface ContentProps {
  page: string;
}

const Content: FC<ContentProps> = ({ page }) => {
  const data: DTRDisplayObject = buildDTRDisplayData(rawData2);
  return (
    <div className="content-wrapper">
      <section className="content">
        <main role="main">
          <form>
            <div className="main">
              <div className="container">
                {Object.values(CURRENT_REPORT_PAGES).includes(page) && (
                  <ReportPage data={data} documentDescription={page} />
                )}
                {page === PAGE.INDEX && (
                  <ReportPage
                    data={data}
                    documentDescription={CURRENT_REPORT_PAGES.LUR}
                  />
                )}
                {page === PAGE.SEARCH && <SearchPage />}
                {page === PAGE.ADMIN && <AdminPage />}
              </div>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
};

export default Content;
