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
let selectedProvisionsUrl = `${
  window.location.origin
}/report/nfr-provisions/${encodeURI(variantName)}`;
console.log("nfrDataId: " + nfrDataId);
console.log(nfrDataId != "");
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
            "select",
          ];
          var columnType = columnTypes[meta.col];
          var id = row["id"];
          var group = row["group"];
          var max = row["max"];

          if (columnType === "max" || columnType === "id") {
            return `<input type='hidden' value='${data}' />`;
          } else if (columnType === "free_text") {
            return `<input type='text' value='${data}' id='${columnType}-${id}' style='width: 100%;' />`;
          } else {
            return `<input type='text' value='${data}' readonly style='color: gray; width: 100%;' />`;
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
    if (data.select === false) {
      $(row).hide();
    }
  },
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
    { data: "free_text" },
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
            return `<input type='text' id='${columnType}-${id}' value='${data}' readonly style='color: gray; width: 100%;' />`;
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
            $(`.variable-provision-row-${id}`).show();
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

variableTable = $("#variableTable").DataTable({
  ajax: {
    url: `${window.location.origin}/report/get-provision-variables/${encodeURI(
      variantName
    )}`,
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
          var provisionId = row["provisionId"];

          if (columnType === "id") {
            return `<input type='text' id='variable-${data}' data-id='${data}' hidden>`;
          } else if (columnType === "provisionId") {
            return `<input type='text' id='variable_${columnType}-${id}' data-id='${data}' hidden>`;
          } else if (columnType === "variable_value") {
            return `<input type='text' id='${columnType}-${id}' value='${data}' style='width: 100%;' />`;
          } else {
            return `<input type='text' id='${columnType}-${id}' value='${data}' readonly style='color: gray; width: 100%;' />`;
          }
        } else {
          return data;
        }
      },
    },
  ],
  rowCallback: function (row, data, index) {
    $(row).addClass(`variable-provision-row-${data.provisionId}`);
    $(row).hide();
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
  let enabledProvisions = [];
  $("#provisionTable")
    .find(".provisionSelect:checked")
    .each(function () {
      enabledProvisions.push($(this).data("id"));
    });
  const data = {
    dtid: dtid,
    variant_name: decodeURI(variantName),
    status: "In Progress",
    enabled_provisions: enabledProvisions,
  };
  fetch(`${window.location.origin}/report/save-nfr`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
