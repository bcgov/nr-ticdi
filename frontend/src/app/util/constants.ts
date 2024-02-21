export const PAGE = {
  INDEX: "",
  SEARCH: "search",
  ADMIN: "admin",
  REPORT: "report",
};

// should eventually be stored in a table in the db and obtained from there
export const CURRENT_REPORT_PAGES = {
  LUR: "Land Use Report",
  GL: "Grazing Lease",
  NFR_DEFAULT: "Notice of Final Review",
  NFR_DELAYED: "Notice of Final Review (Delayed)",
  NFR_NO_FEES: "Notice of Final Review (No Fees)",
  NFR_SURVEY_REQ: "Notice of Final Review (Survey Required)",
  NFR_TO_OBTAIN: "Notice of Final Review (To Obtain Survey)",
};

// similar to the above comment
export const NFR_REPORT_PAGES = {
  NFR_DEFAULT: "Notice of Final Review",
  NFR_DELAYED: "Notice of Final Review (Delayed)",
  NFR_NO_FEES: "Notice of Final Review (No Fees)",
  NFR_SURVEY_REQ: "Notice of Final Review (Survey Required)",
  NFR_TO_OBTAIN: "Notice of Final Review (To Obtain Survey)",
};
