const dtid = +$("#dtid").text();
const groupMaxJsonInput = document.getElementById("groupMaxJson");
let groupMaxJsonArray = JSON.parse(groupMaxJsonInput.value);
groupMaxJsonArray = JSON.parse(groupMaxJsonArray);
let defaultGroup = 0;
if (Array.isArray(groupMaxJsonArray) && groupMaxJsonArray.length > 0) {
  defaultGroup = groupMaxJsonArray.reduce((acc, curr) =>
    acc.provision_group < curr.provision_group ? acc : curr
  ).provision_group;
}
let groupMaxTable;
let provisionTable, variableTable, selectedProvisionsTable;

const nfrDataId = $("#nfrDataId").val();
$(".dataSection dd").each(function () {
  if ($(this).text() == "" || $(this).text() == "TBD") {
    $(this).text(" ");
    $(this).css("border", "solid 1px orange");
  }
});

$(".legalDesc").each(function () {
  if ($(this).text().length > 2000) {
    $(this).text($(this).text().substr(0, 2000) + "...");
  }
});
if ($("#adminLink").text() == "-") {
  $("#adminLink").hide();
}
groupMaxTable = $("#groupMaxTable").DataTable({
  ajax: {
    url: `${window.location.origin}/report/get-group-max/${variantName}`,
    dataSrc: "",
  },
  columns: [
    { data: "provision_group", title: "Group" },
    { data: "max", title: "Max" },
    { data: "provision_group_text", title: "Group Text" },
  ],
  order: [0, "asc"],
});

provisionTable = $("#provisionTable").DataTable({
  ajax: {
    url: `${window.location.origin}/report/nfr-provisions/${encodeURI(
      variantName
    )}/-1`,
    dataSrc: "",
  },
  paging: false,
  info: false,
  bFilter: false,
  columns: [
    { data: "type" },
    { data: "provision_name" },
    { data: "free_text", defaultContent: "" },
    { data: "category" },
    { data: "select" },
    { data: "provision_group" },
    { data: "max" },
    { data: "id" },
  ],
  columnDefs: [
    {
      targets: [0, 1, 2, 3, 4, 5, 6, 7],
      render: function (data, type, row, meta) {
        if (type === "display") {
          var columnTypes = [
            "type",
            "provision_name",
            "free_text",
            "category",
            "select",
            "provision_group",
            "max",
            "id",
          ];
          var columnType = columnTypes[meta.col];
          var id = row["id"];
          var group = row["provision_group"];
          var max = row["max"];

          if (columnType === "select") {
            const checked =
              preloadEnabledProvisions.includes(id) === true ? "checked" : "";
            return `<input type='checkbox' class='provisionSelect' id='active-${id}' data-id='${id}' data-group='${group}' data-max='${max}' ${checked}>`;
          } else if (
            columnType === "max" ||
            columnType === "provision_group" ||
            columnType === "id"
          ) {
            return `<input type='hidden' id='${columnType}-${id}' value='${data}' />`;
          } else {
            return `<input type='text' id='${columnType}-${id}' value='${data}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          }
        } else {
          return data;
        }
      },
    },
    {
      targets: 4,
      className: "text-center",
      orderDataType: "dom-checkbox",
    },
    {
      targets: [5, 6, 7],
      orderable: false,
    },
  ],
  rowCallback: function (row, data, index) {
    $(row).attr("data-id", data.id);
    if (!preloadEnabledProvisions.includes(data.id)) {
      $(row).hide();
    }
  },
  drawCallback: function (settings) {
    // add event listeners to the provision checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 0) {
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("click", function () {
          const group = checkbox.dataset.group;
          const max = checkbox.dataset.max;
          const id = checkbox.dataset.id;
          const active = document.querySelectorAll(
            `input[type="checkbox"][data-group="${group}"]:checked`
          ).length;
          if (active >= max) {
            document
              .querySelectorAll(
                `input[type="checkbox"][data-group="${group}"]:not(:checked)`
              )
              .forEach((checkbox) => {
                checkbox.disabled = true;
              });
          } else {
            document
              .querySelectorAll(
                `input[type="checkbox"][data-group="${group}"]:not(:checked)`
              )
              .forEach((checkbox) => {
                checkbox.disabled = false;
              });
          }
          if (checkbox.checked) {
            $(`#selected-provision-row-${id}`).show();
            $(`.variable-provision-row-${id}`).show();
          } else {
            $(`#selected-provision-row-${id}`).hide();
            $(`.variable-provision-row-${id}`).hide();
          }
        });
        const g = checkbox.dataset.group;
        const m = checkbox.dataset.max;
        const a = document.querySelectorAll(
          `input[type="checkbox"][data-group="${g}"]:checked`
        ).length;
        if (a >= m) {
          document
            .querySelectorAll(
              `input[type="checkbox"][data-group="${g}"]:not(:checked)`
            )
            .forEach((checkbox) => {
              checkbox.disabled = true;
            });
        }
      });
    }
  },
  order: [[1, "asc"]],
});

let selectedProvisionsUrl = `${
  window.location.origin
}/report/nfr-provisions/${encodeURI(variantName)}`;
selectedProvisionsUrl += nfrDataId != "" ? `/${nfrDataId}` : "/-1";
selectedProvisionsTable = $("#selectedProvisionsTable").DataTable({
  ajax: {
    url: selectedProvisionsUrl,
    dataSrc: "",
  },
  paging: false,
  info: false,
  bFilter: false,
  rowId: function (data) {
    return `selected-provision-row-${data.id}`;
  },
  columns: [
    { data: "type" },
    { data: "provision_group" },
    { data: "provision_name" },
    { data: "free_text" },
    { data: "category" },
    { data: "max" },
    { data: "id" },
  ],
  columnDefs: [
    {
      targets: [0, 1, 2, 3, 4, 5, 6],
      render: function (data, type, row, meta) {
        if (type === "display") {
          var columnTypes = [
            "type",
            "provision_group",
            "provision_name",
            "free_text",
            "category",
            "max",
            "id",
          ];
          var columnType = columnTypes[meta.col];
          var id = row["id"];

          if (columnType === "max" || columnType === "id") {
            return `<input type='hidden' value='${data}' />`;
          } else if (columnType === "free_text") {
            return `<input type='text' value='${data}' class='${columnType}' style='width: 100%;' />`;
          } else {
            return `<input type='text' value='${data}' class='${columnType}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          }
        } else {
          return data;
        }
      },
    },
    {
      targets: [5, 6],
      orderable: false,
    },
  ],
  order: [[1, "asc"]],
  rowCallback: function (row, data) {
    $(row).attr("data-id", data.id);
    if (!preloadEnabledProvisions.includes(data.id)) {
      $(row).hide();
    }
  },
});

let variablesUrl = `${
  window.location.origin
}/report/get-provision-variables/${encodeURI(variantName)}`;
variablesUrl += nfrDataId != "" ? `/${nfrDataId}` : "/-1";
console.log(variablesUrl);
variableTable = $("#variableTable").DataTable({
  ajax: {
    url: variablesUrl,
    dataSrc: "",
  },
  paging: false,
  info: false,
  bFilter: false,
  columns: [
    { data: "variable_name" },
    { data: "variable_value" },
    { data: "id" },
    { data: "provisionId" },
  ],
  columnDefs: [
    {
      targets: [0, 1, 2, 3],
      render: function (data, type, row, meta) {
        if (type === "display") {
          var columnTypes = [
            "variable_name",
            "variable_value",
            "id",
            "provisionId",
          ];
          var columnType = columnTypes[meta.col];
          var id = row["id"];

          if (columnType === "id") {
            return `<input type='text' data-id='${data}' hidden>`;
          } else if (columnType === "provisionId") {
            return `<input type='text' data-id='${data}' hidden>`;
          } else if (columnType === "variable_value") {
            return `<input type='text' class='${columnType}' value='${data}' style='width: 100%;' />`;
          } else {
            return `<input type='text' class='${columnType}' value='${data}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          }
        } else {
          return data;
        }
      },
    },
  ],
  rowCallback: function (row, data, index) {
    $(row).addClass(`variable-provision-row-${data.provisionId}`);
    $(row).attr("data-id", data.provisionId);
    $(row).attr("data-variable_id", data.id);
    if (!preloadEnabledProvisions.includes(data.provisionId)) {
      $(row).hide();
    }
  },
  order: [[0, "asc"]],
});

// Don't reload the page when Save For Later button is clicked
document.querySelector("#saveNfr").addEventListener("click", function (event) {
  event.preventDefault();
});

// event listener for the Select A Group dropdown
$("#group-select").on("change", function () {
  const selectedGroup = $(this).val();
  provisionTable.rows().every(function () {
    const provisionGroup = this.data().provision_group;
    if (selectedGroup == "" || provisionGroup == selectedGroup) {
      $(this.node()).show();
    } else {
      $(this.node()).hide();
    }
  });
  if (Array.isArray(groupMaxJsonArray) && groupMaxJsonArray.length > 0) {
    const groupMax = groupMaxJsonArray.find(
      (element) => element.provision_group == selectedGroup
    ).max;
    $("#maxGroupNum").text(groupMax);
  }
});

function filterRows() {
  const selectedGroup = $("#group-select").val();
  if (Array.isArray(groupMaxJsonArray) && groupMaxJsonArray.length > 0) {
    const groupMax = groupMaxJsonArray.find(
      (element) => element.provision_group == selectedGroup
    ).max;
    $("#maxGroupNum").text(groupMax);
    provisionTable.rows().every(function () {
      const provisionGroup = this.data().provision_group;
      if (selectedGroup == "" || provisionGroup == selectedGroup) {
        $(this.node()).show();
      } else {
        $(this.node()).hide();
      }
    });
  }
}

$("#provisionLegend").click(function () {
  filterRows();
});

// collapsible sections
$("fieldset legend").click(function () {
  $(this).parent().find(".contents").toggle();
  if ($(".fa", this).hasClass("fa-plus")) {
    $(".fa", this).removeClass("fa-plus").addClass("fa-minus");
  } else {
    $(".fa", this).removeClass("fa-minus").addClass("fa-plus");
  }
});

function saveForLater() {
  // get the provisions that the user has selected
  const dtid = $("#dtid").text();
  let provisionArray = [];
  let variableArray = [];
  selectedProvisionsTable
    .rows()
    .nodes()
    .each((row) => {
      if ($(row).css("display") !== "none") {
        const provision_id = $(row).data("id");
        const free_text = $(row).find(".free_text").val();
        provisionArray.push({
          provision_id: provision_id,
          free_text: free_text,
        });
      }
    });
  variableTable
    .rows()
    .nodes()
    .each((row) => {
      if ($(row).css("display") !== "none") {
        const provision_id = $(row).data("id");
        const variable_id = $(row).data("variable_id");
        const variable_value = $(row).find(".variable_value").val();
        variableArray.push({
          provision_id: provision_id,
          variable_id: variable_id,
          variable_value: variable_value,
        });
      }
    });
  const data = {
    dtid: dtid,
    variant_name: variantName,
    status: "In Progress",
    provisionArray: provisionArray,
    variableArray: variableArray,
  };
  fetch(`${window.location.origin}/report/save-nfr`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function generateNFRReport() {
  const tenureFileNumber = $("#tfn").text();
  const dtid = $("#dtid").text();
  $("#genReport").prop("disabled", true);
  const reportName = await fetch(
    `/report/get-nfr-report-name/${dtid}/${tenureFileNumber}`,
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

  const provisionIds = getEnabledProvisionIds();
  const provisionJson = getProvisionJson(provisionIds);
  const variableJson = getVariableJson(provisionIds);
  const data = {
    dtid: dtid,
    variantName: variantName,
    provisionJson: provisionJson,
    variableJson: variableJson,
  };
  fetch(`/report/generate-nfr-report`, {
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

function getEnabledProvisionIds() {
  let provisionIds = [];
  $("#provisionTable")
    .find(".provisionSelect:checked")
    .each(function () {
      provisionIds.push($(this).data("id"));
    });
  return provisionIds;
}

function getProvisionJson(provisionIds) {
  var data = [];
  $("#selectedProvisionsTable tbody tr").each(function () {
    var row = $(this);
    var provision_id = parseInt(row.attr("data-id"));

    // Only include rows with provisionId in the list
    if (provisionIds.includes(provision_id)) {
      var provision_name = row.find(".provision_name").val();
      var provision_group = row.find(".provision_group").val();
      var free_text = row.find(".free_text").val();

      var rowData = {
        provision_id: provision_id,
        provision_group: provision_group,
        provision_name: provision_name,
        free_text: free_text,
      };

      data.push(rowData);
    }
  });
  return data;
}

function getVariableJson(provisionIds) {
  var data = [];
  $("#variableTable tbody tr").each(function () {
    var row = $(this);
    var provision_id = parseInt(row.attr("data-id"));

    // Only include rows with provisionId in the list
    if (provisionIds.includes(provision_id)) {
      var variable_name = row.find(".variable_name").val();
      var variable_value = row.find(".variable_value").val();
      var variable_id = row.data("variable_id");

      var rowData = {
        provision_id: provision_id,
        variable_id: variable_id,
        variable_name: variable_name,
        variable_value: variable_value,
      };

      data.push(rowData);
    }
  });
  return data;
}
