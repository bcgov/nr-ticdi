import React from "react";
import IndexPage from "./Pages/Index/IndexPage";

function Content({ page }) {
  const data = {
    dtid: "123",
    tenure_file_number: "321",
    primary_contact_name: "test",
    contact_agent: "Mike",
    organization_unit: "test",
    email_address: "test@test.com",
    phone_number: "(321) 321-3210",
    contact_email_address: "test2@test.com",
    contact_phone_number: "(123) 123-1234",
    incorporation_number: "888",
    inspected_date: "Today",
  };
  return (
    <div className="container mx-auto max-w-screen-xl p-4">
      {page === "index" && <IndexPage data={data} />}
    </div>
  );
}

export default Content;
