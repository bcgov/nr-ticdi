async function generateReport(documentType) {
  const tenureFileNumber = $("#tfn").text();
  const prdid = $("#prdid").text();
  const dtid = $("#dtid").text();
  $("#genReport").prop("disabled", true);
  const reportName = await fetch(
    `/report/get-report-name/${dtid}/${tenureFileNumber}/${documentType}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "application/json",
    }
  )
    .then((res) => res.json())
    .then((resJson) => {
      return resJson.reportName;
    })
    .catch(() => {
      location.reload();
    });
  console.log(reportName)
  const data = {
    prdid: prdid,
    dtid: dtid,
    document_type: documentType,
  };
  fetch(`/report/generate-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "application/json",
    body: JSON.stringify(data),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = reportName + ".docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      $("#genReport").prop("disabled", false);
    })
    .catch(() => {
      location.reload();
      $("#genReport").prop("disabled", false);
    });
}
