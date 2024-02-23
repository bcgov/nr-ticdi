export const PAGE = [
  {
    title: "Land Use Report",
    path: "",
  },
  {
    title: "Grazing Lease",
    path: "Grazing Lease",
  },
  {
    title: "Notice of Final Review",
    path: "Notice of Final Review",
  },
  {
    title: "Notice of Final Review (Delayed)",
    path: "Notice of Final Review (Delayed)",
  },
  {
    title: "Notice of Final Review (No Fees)",
    path: "Notice of Final Review (No Fees)",
  },
  {
    title: "Notice of Final Review (Survey Required)",
    path: "Notice of Final Review (Survey Required)",
  },
  {
    title: "Notice of Final Review (To Obtain Survey)",
    path: "Notice of Final Review (To Obtain Survey)",
  },
  {
    title: "Search",
    path: "search",
  },
  {
    title: "Admin",
    path: "admin",
  },
];

// should eventually be stored in a table in the db and obtained from there
export const CURRENT_REPORTS = [
  "Land Use Report",
  "Grazing Lease",
  "Notice of Final Review",
  "Notice of Final Review (Delayed)",
  "Notice of Final Review (No Fees)",
  "Notice of Final Review (Survey Required)",
  "Notice of Final Review (To Obtain Survey)",
];

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
