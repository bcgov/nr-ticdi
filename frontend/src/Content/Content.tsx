import React from "react";
import IndexPage from "./Pages/Index/IndexPage";
import { rawData, testData } from "../app/constants/constants";

function Content({ page }) {
  return (
    <div className="container">
      {page === "index" && <IndexPage data={rawData} />}
    </div>
  );
}

export default Content;
