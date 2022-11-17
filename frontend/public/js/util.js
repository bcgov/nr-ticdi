async function generateReport() {
  const dtid = $("#dtid").text();
  const prdid = $("#prdid").text();
  $("#genReport").prop("disabled", true);
  const reportName = await fetch(`/report/getReportName/${dtid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "application/json",
  })
    .then((res) => res.json())
    .then((resJson) => {
      return resJson.reportName;
    })
    .catch(() => {
      location.reload();
    });
  const comments = $("#document_type_id option:selected").text();
  const version = $("#versionSelect option:selected").text();
  const data = {
    prdid: prdid,
    version: version,
    comments: comments,
  };
  fetch(`/report/generateReport`, {
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
