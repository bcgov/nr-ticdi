const dtid = $("#dtid").val();
const groupMaxJsonInput = document.getElementById("groupMaxJson");
let groupMaxJsonArray = JSON.parse(groupMaxJsonInput.value);
groupMaxJsonArray = JSON.parse(groupMaxJsonArray);
const defaultGroup = groupMaxJsonArray.reduce((acc, curr) =>
  acc.provision_group < curr.provision_group ? acc : curr
).provision_group;
let groupMaxTable;
let provisionTable;
$(document).ready(function () {
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
      url: `${window.location.origin}/admin/get-group-max/${dtid}`,
      dataSrc: "",
    },
    columns: [
      { data: "provision_group", title: "Group" },
      { data: "max", title: "Max" },
      { data: "provision_group_text", title: "Group Text" },
    ],
    order: [0, "asc"],
  });

  selectedProvisionsTable = $("#selectedProvisionsTable").DataTable({
    ajax: {
      url: `${window.location.origin}/admin/nfr-provisions/${dtid}`,
      dataSrc: "",
    },
    paging: false,
    bFilter: false,
    columns: [
      { data: "type" },
      { data: "provision_group" },
      { data: "provision_text" },
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
              "provision_text",
              "free_text",
              "category",
              "max",
              "id",
            ];
            var columnType = columnTypes[meta.col];
            var id = row["id"];
            var group = row["group"];
            var max = row["max"];

            if (columnType === "max" || columnType === "id") {
              return `<input type='hidden' value='${data}' />`;
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
      url: `${window.location.origin}/admin/nfr-provisions/${dtid}`,
      dataSrc: "",
    },
    paging: false,
    bFilter: false,
    columns: [
      { data: "type" },
      { data: "provision_text" },
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
              "provision_text",
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
              const checked = data === true ? "checked" : "";
              return `<input type='checkbox' id='active-${id}' data-id='${id}' data-group='${group}' data-max='${max}' ${checked}>`;
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
              fetch(
                `${window.location.origin}/admin/select-provision/${checkbox.dataset.id}`
              ).then((res) => selectedProvisionsTable.ajax.reload().draw());
            } else {
              fetch(
                `${window.location.origin}/admin/deselect-provision/${checkbox.dataset.id}`
              ).then((res) => selectedProvisionsTable.ajax.reload().draw());
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

  $("#variableTable").DataTable({
    paging: false,
    bFilter: false,
    columns: [{ data: "type" }, { data: "provision" }, { data: "selectedVar" }],
    columnDefs: [
      {
        targets: [0, 1, 2],
        render: function (data, type, row, meta) {
          if (type === "display") {
            var columnTypes = [
              "documentVariableName",
              "enterText",
              "selectedVar",
            ];
            var columnType = columnTypes[meta.col];
            var selectedVar = row["selectedVar"];

            if (columnType === "selectedVar") {
              return (
                "<input type='radio' data-id='variable-" + selectedVar + "'>"
              );
            } else {
              return (
                "<input type='text' id='" +
                columnType +
                "-" +
                selectedVar +
                "' value='" +
                data +
                "' readonly style='color: gray; width: 100%;' />"
              );
            }
          } else {
            return data;
          }
        },
      },
      {
        targets: 2,
        orderDataType: "dom-checkbox",
      },
    ],
  });
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
