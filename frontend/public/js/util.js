function generateReport() {
  const dtid = $("#dtid").text();
  $("#genReport").prop("disabled", true);
  let reportName;
  fetch(`/report/getReportName/${dtid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "application/json",
  }).then((res) => {
    console.log(res);
    console.log(res.data);
  });
  reportName = "LUR_nnnnnnn_0001";
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
      alert("Something went wrong");
      $("#genReport").prop("disabled", false);
    });
}
