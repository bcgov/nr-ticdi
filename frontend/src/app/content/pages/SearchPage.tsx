import { FC, useEffect, useState } from "react";
import { getSearchData } from "../../common/search";
import SearchDataTable, {
  SearchData,
} from "../../components/table/SearchDataTable";

const SearchPage: FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadDocument = async () => {
    // setIsDownloading(true);
    // const dtid = (document.getElementById("searchInput") as HTMLInputElement)
    //   .value;
    // const template_id = (
    //   document.querySelector(
    //     'input[name="radioActive"]:checked'
    //   ) as HTMLInputElement
    // ).id.replace("active-", "");
    // try {
    //   const blob = await generateReport(dtid, template_id);
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `report_${new Date().toISOString()}.docx`;
    //   document.body.appendChild(a);
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // } catch (error) {
    //   console.error("Error generating report:", error);
    // } finally {
    //   setIsDownloading(false);
    // }
  };

  return (
    <SearchDataTable />
    // <>
    //   <div className="container container-fluid">
    //     <h2>Search</h2>
    //     <hr />
    //     <div className="row">
    //       <div>
    //         <table id="documentTable">
    //           <thead>
    //             <th style={{ minWidth: "80px" }}>DTID</th>
    //             <th style={{ minWidth: "40px" }}>Doc No.</th>
    //             <th style={{ minWidth: "300px" }}>Template Name</th>
    //             <th style={{ maxWidth: "120px" }}>Uploaded Date</th>
    //             <th style={{ minWidth: "80px" }}>Status</th>
    //             <th></th> {/* Active */}
    //             <th></th> {/* NFR_ID */}
    //             <th></th> {/* variant_name */}
    //           </thead>
    //           <tbody id="documentTableBody">
    //             <tr></tr>
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //     <div className="row justify-content-end">
    //       <div className="col-md-5">
    //         <button
    //           type="button"
    //           className="btn btn-success"
    //           onClick={handleDownloadDocument}
    //         >
    //           {isDownloading ? "Opening..." : "Open"}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
};

export default SearchPage;
