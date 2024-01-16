import { FC } from "react";
import { rawData2 } from "../../app/constants/constants";
import { DTRDisplayObject } from "../types/types";
import { buildDTRDisplayData } from "../util/util";
import ReportPage from "./pages/ReportPage";

interface ContentProps {
  page: string;
}

const reportInfo = {
  id: 1,
  name: "Land Use Report",
};

const Content: FC<ContentProps> = ({ page }) => {
  const data: DTRDisplayObject = buildDTRDisplayData(rawData2);
  return (
    <div className="content-wrapper">
      <section className="content">
        <main role="main">
          <form>
            <div className="main">
              <div className="container">
                {page === "report" && (
                  <ReportPage data={data} reportType={reportInfo.name} />
                )}
                {/* {page === "search" && (
                  <SearchPage />
                )}
                {page === "admin" && (
                  <AdminPage />
                )} */}
              </div>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
};

export default Content;
