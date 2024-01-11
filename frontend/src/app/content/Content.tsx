import { FC } from "react";
import IndexPage from "./pages/IndexPage";
import { rawData2 } from "../../app/constants/constants";
import { DTRDisplayObject } from "../types/types";
import { buildDTRDisplayData } from "../util/util";

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
                {page === "index" && <IndexPage data={data} />}
              </div>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
};

export default Content;
