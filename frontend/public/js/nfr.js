const dtid = +$("#dtid").text();
let preloadedProvisions = false;
let preloadedSelected = false;
let preloadedVariables = false;
let reloadingTables = false;
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
    if ($(this).attr("id") == "address2" || $(this).attr("id") == "address3") {
      $(this).hide();
    }
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
    { data: "help_text" },
    { data: "select" },
    { data: "provision_group" },
    { data: "max" },
    { data: "id" },
    { data: "free_text" },
  ],
  columnDefs: [
    {
      targets: [0, 1, 2, 3, 4, 5, 6, 7],
      render: function (data, type, row, meta) {
        if (type === "display") {
          var columnTypes = [
            "type",
            "provision_name",
            "help_text",
            "select",
            "provision_group",
            "max",
            "id",
            "free_text",
          ];
          var columnType = columnTypes[meta.col];
          var id = row["id"];
          var group = row["provision_group"];
          var max = row["max"];
          var mandatory = row["type"] == "M" ? true : false;
          var provisionName = row["provision_name"];
          var xor =
            provisionName ==
              "MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED" ||
            provisionName ==
              "ESTIMATED MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED"
              ? 1
              : 0;

          if (columnType === "select") {
            const checked =
              enabledProvisions.includes(id) === true ? "checked" : "";
            return `<input type='checkbox' class='provisionSelect' id='active-${id}' data-id='${id}' data-group='${group}' data-max='${max}' data-mandatory='${mandatory}' data-xor='${xor}' ${checked}>`;
          } else if (
            columnType === "max" ||
            columnType === "id" ||
            columnType === "free_text"
          ) {
            return `<input type='hidden' id='${columnType}-${id}' value='${data}' />`;
          } else if (columnType === "help_text") {
            return `<input type='text' value='${data}' title='${data}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          } else if (columnType === "provision_group") {
            return `<input type='hidden' class='provisionGroupValue' value='${data}' />`;
          } else {
            return `<input type='text' id='${columnType}-${id}' value='${data}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          }
        } else {
          return data;
        }
      },
    },
    {
      targets: 3,
      className: "text-center",
      orderDataType: "dom-checkbox",
    },
    {
      targets: [0, 1, 2, 3, 4, 5, 6, 7],
      orderable: false,
    },
  ],
  rowCallback: function (row, data, index) {
    $(row).attr("data-id", data.id);
    if (
      !enabledProvisions.includes(data.id) &&
      (!preloadedProvisions || reloadingTables)
    ) {
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
          const xor = checkbox.dataset.xor;
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
            if (xor != 0) {
              // disable the checkboxes that have the same xor
              document
                .querySelectorAll(
                  `input[type="checkbox"][data-group="${group}"][data-xor="${xor}"]:not(#${checkbox.id})`
                )
                .forEach((checkbox) => {
                  checkbox.disabled = true;
                });
            }
          } else {
            $(`#selected-provision-row-${id}`).hide();
            $(`.variable-provision-row-${id}`).hide();
            if (xor != 0) {
              // enable the checkboxes that have the same xor
              document
                .querySelectorAll(
                  `input[type="checkbox"][data-group="${group}"][data-xor="${xor}"]:not(#${checkbox.id})`
                )
                .forEach((checkbox) => {
                  checkbox.disabled = false;
                });
            }
          }
        });
        const grp = checkbox.dataset.group;
        const mx = checkbox.dataset.max;
        const act = document.querySelectorAll(
          `input[type="checkbox"][data-group="${grp}"]:checked`
        ).length;
        if (act >= mx) {
          document
            .querySelectorAll(
              `input[type="checkbox"][data-group="${grp}"]:not(:checked)`
            )
            .forEach((checkbox) => {
              checkbox.disabled = true;
            });
        }
      });
    }
    if (reloadingTables) {
      // reloadingTables will be false for preload and true after the user changes the dropdown select
      const gmUrl = `${window.location.origin}/report/get-group-max/${variantName}`;
      const spUrl = `${
        window.location.origin
      }/report/nfr-provisions/${encodeURI(variantName)}/${dtid}`;
      const vUrl = `${
        window.location.origin
      }/report/get-provision-variables/${encodeURI(variantName)}/${dtid}`;
      fetch(`/report/get-group-max/${variantName}`)
        .then((res) => {
          return res.json();
        })
        .then((resJson) => {
          groupMaxJsonArray = resJson;
          updateGroupSelect(groupMaxJsonArray);
          groupMaxTable.ajax.url(gmUrl).load();
          groupMaxTable.draw();
          selectedProvisionsTable.ajax.url(spUrl).load();
          selectedProvisionsTable.draw();
          variableTable.ajax.url(vUrl).load();
          variableTable.draw();
        });
    }
  },
  initComplete: function (settings, json) {
    preloadedProvisions = true;
  },
  order: [[1, "asc"]],
});

let selectedProvisionsUrl = `${
  window.location.origin
}/report/nfr-provisions/${encodeURI(variantName)}/${dtid}`;
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
    { data: "category" },
    { data: "free_text" },
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
            "category",
            "free_text",
            "max",
            "id",
          ];
          var columnType = columnTypes[meta.col];
          var id = row["id"];

          if (columnType === "max" || columnType === "id") {
            return `<input type='hidden' value='${data}' />`;
          } else if (columnType === "free_text") {
            return `<input type='hidden' value='${data}' class='${columnType}' style='width: 100%;' />`;
          } else if (columnType === "provision_name") {
            return `<input type='text' value='${data}' title='${data}' class='${columnType}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          } else {
            return `<input type='text' value='${data}' class='${columnType}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          }
        } else {
          return data;
        }
      },
    },
    {
      targets: [0, 1, 2, 3, 4, 5, 6],
      orderable: false,
    },
  ],
  order: [[1, "asc"]],
  rowCallback: function (row, data) {
    $(row).attr("data-id", data.id);
    if (
      !enabledProvisions.includes(data.id) &&
      (!preloadedSelected || reloadingTables)
    ) {
      $(row).hide();
    }
  },
  initComplete: function (settings, json) {
    preloadedSelected = true;
  },
});

let variablesUrl = `${
  window.location.origin
}/report/get-provision-variables/${encodeURI(variantName)}/${dtid}`;
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
    { data: "help_text" },
    { data: "id" },
    { data: "provisionId" },
  ],
  columnDefs: [
    {
      targets: [0, 1, 2, 3, 4],
      render: function (data, type, row, meta) {
        if (type === "display") {
          var columnTypes = [
            "variable_name",
            "variable_value",
            "help_text",
            "id",
            "provisionId",
          ];
          var columnType = columnTypes[meta.col];
          var id = row["id"];

          if (columnType === "id" || columnType === "provisionId") {
            return `<input type='text' data-id='${data}' hidden>`;
          } else if (columnType === "variable_value") {
            return `<input type='text' class='${columnType}' value='${data}' style='width: 100%;' />`;
          } else if (columnType === "help_text") {
            return `<input type='text' value='${data}' title='${data}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          } else {
            return `<input type='text' class='${columnType}' value='${data}' tabIndex='-1' readonly style='color: gray; width: 100%;' />`;
          }
        } else {
          return data;
        }
      },
      orderable: false,
    },
  ],
  rowCallback: function (row, data, index) {
    $(row).addClass(`variable-provision-row-${data.provisionId}`);
    $(row).attr("data-id", data.provisionId);
    $(row).attr("data-variable_id", data.id);
    if (
      !enabledProvisions.includes(data.provisionId) &&
      (!preloadedVariables || reloadingTables)
    ) {
      $(row).hide();
    }
  },
  initComplete: function (settings, json) {
    preloadedVariables = true;
  },
  order: [[0, "asc"]],
});

// Don't reload the page when Save For Later button is clicked
document.querySelector("#saveNfr").addEventListener("click", function (event) {
  event.preventDefault();
});

// When the selected variant changes, the tables need to be reloaded and
// mandatory and enabled provisions need to be fetched
$("#documentVariantId").on("change", function () {
  variantName = $(this).val();
  reloadingTables = true;
  const pUrl = `${window.location.origin}/report/nfr-provisions/${encodeURI(
    variantName
  )}/-1`;
  fetch(`/report/enabled-provisions/${encodeURI(variantName)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "application/json",
  })
    .then((res) => res.json())
    .then((newMandatoryProvisions) => {
      mandatoryProvisions = newMandatoryProvisions;
      fetch(`/report/enabled-provisions2/${encodeURI(variantName)}/${dtid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "application/json",
      })
        .then((res) => res.json())
        .then((newEnabledProvisions) => {
          enabledProvisions = newEnabledProvisions;
        })
        .then(() => {
          provisionTable.ajax.url(pUrl).load();
        });
    });
});

// event listener for the Select A Group dropdown
$("#group-select").on("change", function () {
  const selectedGroup = $(this).val();
  if (selectedGroup != 0) {
    const selectedOption = $(this).find("option:selected");
    selectedOption.addClass("viewed");
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
      const groupMaxText =
        groupMax == 999 ? "" : "Max for this Group is " + groupMax;
      $("#maxGroupNum").text(groupMaxText);
    }
  } else {
    $("#maxGroupNum").text("");
    provisionTable.rows().every(function () {
      $(this.node()).hide();
    });
  }
});

function filterRows() {
  const selectedGroup = $("#group-select").val();
  if (
    selectedGroup != 0 &&
    Array.isArray(groupMaxJsonArray) &&
    groupMaxJsonArray.length > 0
  ) {
    const groupMax = groupMaxJsonArray.find(
      (element) => element.provision_group == selectedGroup
    ).max;
    const groupMaxText =
      groupMax == 999 ? "" : "Max for this Group is " + groupMax;
    $("#maxGroupNum").text(groupMaxText);
    provisionTable.rows().every(function () {
      const provisionGroup = this.data().provision_group;
      if (selectedGroup == "" || provisionGroup == selectedGroup) {
        $(this.node()).show();
      } else {
        $(this.node()).hide();
      }
    });
  } else {
    $("#maxGroupNum").text("");
    provisionTable.rows().every(function () {
      $(this.node()).hide();
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
  const savedMsg = document.getElementById("savedMsg");
  const saveBtn = document.getElementById("saveNfr");
  saveBtn.disabled = true;

  const dtid = $("#dtid").text();
  if (dtid != "") {
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
    }).catch((err) => {
      console.log(err);
      saveBtn.disabled = false;
    });
    savedMsg.style.display = "block";
    $(savedMsg).fadeIn("fast");
    setTimeout(function () {
      $(savedMsg).fadeOut("slow", function () {
        // enable the Save For Later button after the saved message div is faded out
        saveBtn.disabled = false;
      });
    }, 2000);
  }
}

async function generateNFRReport() {
  const tenureFileNumber = $("#tfn").text();
  const dtid = $("#dtid").text();
  const unselectedMandatoryGroups = [];
  // Check that all mandatory provisions have been selected
  $("#provisionTable")
    .find("tbody tr")
    .each(function () {
      var isMandatory = $(this).find(".provisionSelect").data("mandatory");
      var xor = $(this).find(".provisionSelect").data("xor");
      var provisionGroup = $(this).find(".provisionGroupValue").val();
      if (isMandatory === true) {
        var provisionSelect = $(this).find(".provisionSelect").prop("checked");
        if (!provisionSelect && xor != 0) {
          // Check if any other provision with the same XOR value is selected
          var otherSelected =
            $(`input[data-xor="${xor}"][data-mandatory="true"]:checked`)
              .length > 0;
          if (!otherSelected) {
            unselectedMandatoryGroups.push(provisionGroup);
          }
        } else if (!provisionSelect) {
          unselectedMandatoryGroups.push(provisionGroup);
        }
      }
    });
  if (unselectedMandatoryGroups.length == 0) {
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
  } else {
    const uniqueProvisionGroups = [...new Set(unselectedMandatoryGroups)].sort(
      (a, b) => a - b
    );
    alert(
      "There are unselected mandatory provisions the following groups: " +
        uniqueProvisionGroups.join(", ")
    );
  }
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

function updateGroupSelect(groupMaxJsonArray) {
  // repopulate the group select using the new groupMaxJsonArray
  const selectElement = document.getElementById("group-select");
  selectElement.innerHTML = `<option value="0" class="defaultSelect">Select</option>`;
  groupMaxJsonArray.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item.provision_group;
    optionElement.text = `${item.provision_group} - ${item.provision_group_text}`;
    selectElement.appendChild(optionElement);
  });
  // color the first option green
  $("#group-select").find("option:first-child").addClass("viewed");
  // this will update groupMaxNum
  filterRows();
}
