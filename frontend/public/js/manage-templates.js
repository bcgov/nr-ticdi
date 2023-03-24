var documentTable, groupMaxTable, provisionTable;
$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const reportIndex = parseInt(urlParams.get("report"));
  if (reportIndex != 2) {
    $(".nofr-section").hide();
  }
  const reportType =
    reportIndex == 1
      ? "Land Use Report"
      : reportIndex == 2
      ? "Notice of Final Review"
      : "";
  $("#reportTitle").text(reportType);
  // used for sorting the radio buttons
  $.fn.dataTable.ext.order["dom-checkbox"] = function (settings, col) {
    return this.api()
      .column(col, { order: "index" })
      .nodes()
      .map(function (td, i) {
        return $("input", td).prop("checked") ? "1" : "0";
      });
  };
  documentTable = $("#documentTable").DataTable({
    ajax: {
      url: `admin/get-templates/${encodeURIComponent(reportType)}`,
      dataSrc: "",
    },
    paging: true,
    bFilter: true,
    columns: [
      { data: "template_version" },
      { data: "file_name" },
      { data: "update_timestamp" },
      { data: "active_flag" },
      { data: "view" },
      { data: "remove" },
      { data: "id" },
    ],
    columnDefs: [
      {
        targets: [0, 1, 2, 3, 4, 5, 6],
        render: function (data, type, row, meta) {
          if (type === "display") {
            var columnTypes = [
              "template_version",
              "file_name",
              "update_timestamp",
              "active_flag",
              "view",
              "remove",
              "id",
            ];
            var columnType = columnTypes[meta.col];
            var id = row["id"];
            const checked = data === true ? "checked" : "";

            if (columnType === "active_flag") {
              return `<input type='radio' id='active-${id}' data-id='${id}' name='radioActive' onclick='activateTemplate.call(this)' ${checked}>`;
            } else if (columnType === "remove") {
              return `<button class='btn btn-warning remove-template-button' data-id='${id}' data-toggle='modal' data-target='#removeModal'>Remove`;
            } else if (columnType === "view") {
              return `<button class='btn btn-info' id='view-${id}' onclick='downloadTemplate(${id})'>View`;
            } else if (columnType === "id") {
              return `<input type='hidden' id='template_id-${id}' value='${data}' />`;
            } else {
              return `<input type='text' id='${columnType}-${id}' value='${data}' readonly style='color: gray; width: 100%;' />`;
            }
          } else {
            return data;
          }
        },
      },
      {
        targets: [3],
        className: "text-center",
      },
      {
        targets: [4, 5, 6],
        orderable: false,
        searchable: false,
      },
    ],
    createdRow: function (row, data, dataIndex) {
      $(row).attr("id", "row-" + data["id"]);
    },
    order: [[0, "asc"]],
  });
  if (reportIndex == 2) {
    groupMaxTable = $("#groupMaxTable").DataTable({
      ajax: {
        url: "admin/get-group-max",
        dataSrc: "",
      },
      columns: [
        { data: "provision_group", title: "Group" },
        { data: "max", title: "Max" },
        { data: "provision_group_text", title: "Group Description" },
      ],
      order: [0, "asc"],
    });
    provisionTable = $("#provisionTable").DataTable({
      ajax: {
        url: "admin/nfr-provisions",
        dataSrc: "",
      },
      paging: false,
      bFilter: false,
      columns: [
        { data: "type" },
        { data: "provision_group" },
        { data: "max" },
        { data: "provision_name" },
        { data: "free_text" },
        { data: "help_text" },
        { data: "category" },
        { data: "active_flag" },
        { data: "edit" },
        { data: "id" },
        { data: "variants" },
      ],
      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          render: function (data, type, row, meta) {
            if (type === "display") {
              var columnTypes = [
                "type",
                "provision_group",
                "max",
                "provision_name",
                "free_text",
                "help_text",
                "category",
                "active_flag",
                "edit",
                "id",
                "variants",
              ];
              var columnType = columnTypes[meta.col];
              var id = row["id"];
              var group = row["provision_group"];
              var max = row["max"];
              var provisionType = row["type"];
              var mandatory = provisionType == "M" ? true : false;
              var variants = JSON.stringify(row["variants"]);

              if (columnType === "active_flag") {
                const checked = data === true ? "checked" : "";
                return `<input type='checkbox' id='active-${id}' data-id='${id}' data-group='${group}' data-max='${max}' name='radioActive' ${checked}>`;
              } else if (
                columnType === "help_text" ||
                columnType === "id" ||
                columnType === "variants"
              ) {
                return `<input type='hidden' id='${columnType}-${id}' value='${data}' />`;
              } else if (columnType === "edit") {
                return `<a href="#" data-id="${id}" data-variants="${variants}" data-mandatory="${mandatory}" onclick="openEditModal.call(this)">Edit</a>`;
              } else if (columnType === "max") {
                return `<input type='text' id='${columnType}-${id}' value='${
                  data == 999 ? "-" : data
                }' readonly style='color: gray; width: 100%;' />`;
              } else {
                return `<input type='text' id='${columnType}-${id}' value='${data}' readonly style='color: gray; width: 100%;' />`;
              }
            } else {
              return data;
            }
          },
        },
        {
          targets: [7],
          className: "text-center",
          orderDataType: "dom-checkbox",
        },
        {
          targets: [8, 9, 10],
          orderable: false,
        },
      ],
      drawCallback: function (settings) {
        // add event listeners to the provision checkboxes
        const checkboxes = document.querySelectorAll(
          'input[name="radioActive"]'
        );
        if (checkboxes.length > 0) {
          checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("click", function () {
              if (checkbox.checked) {
                fetch(`admin/enable-provision/${checkbox.dataset.id}`);
              } else {
                fetch(`admin/disable-provision/${checkbox.dataset.id}`);
              }
            });
          });
        }
      },
      order: [[1, "asc"]],
    });
    $("#variableTable").DataTable({
      paging: false,
      bFilter: false,
      columnDefs: [
        {
          targets: 0,
          type: "string",
          render: function (data, type, full, meta) {
            if (type === "filter" || type === "sort") {
              var api = new $.fn.dataTable.Api(meta.settings);
              var td = api.cell({ row: meta.row, column: meta.col }).node();
              data = $('select, input[type="text"]', td).val();
            }
            return data;
          },
        },
        {
          targets: 1,
          orderable: false,
        },
      ],
    });
  }
});
// collapsible logic
$("fieldset legend").click(function () {
  $(this).parent().find(".contents").toggle();
  if ($(".fa", this).hasClass("fa-plus")) {
    $(".fa", this).removeClass("fa-plus").addClass("fa-minus");
  } else {
    $(".fa", this).removeClass("fa-minus").addClass("fa-plus");
  }
});
/******************
 * Templates logic *
 *******************/
function downloadTemplate(id) {
  $(":button").prop("disabled", true);
  const template_name = $(`#file_name-${id}`).val();
  fetch(`/admin/download-template/${id}`, {
    method: "GET",
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = template_name + ".docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      $(":button").prop("disabled", false);
    })
    .catch(() => {
      $(":button").prop("disabled", false);
      console.log("Error downloading the template");
    });
}
function removeTemplate() {
  const id = $("#document-template-id").val();
  const urlParams = new URLSearchParams(window.location.search);
  const reportIndex = parseInt(urlParams.get("report"));
  const reportType =
    reportIndex == 1
      ? "Land Use Report"
      : reportIndex == 2
      ? "Notice of Final Review"
      : "";
  fetch(`/admin/remove-template/${reportType}/${id}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((resJson) => {
      $(`#row-${id}`).remove();
      $(`#radio-${resJson.id}`).prop("checked", true);
    })
    .catch(() => {
      console.log("Error removing the template");
    });
}
function activateTemplate() {
  const templateId = $(this).data("id");
  const reportType = $("#reportTitle").text();
  fetch(
    `/admin/activate-template/${templateId}/${encodeURIComponent(reportType)}`,
    {
      method: "GET",
      responseType: "application/json",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors);
      }
    })
    .catch(() => location.reload());
}
// remove template button clicked
$(document).on("click", ".remove-template-button", function () {
  const documentTemplateId = $(this).data("id");
  $(".modal-body #document-template-id").val(documentTemplateId);
});
// clear the modals on close
$("#uploadModal").on("hidden.bs.modal", function () {
  $("#saveButton").prop("disabled", true);
  $(this).find("input").val("");
});
// upload modal confirmation/save
$("#uploadModal").on("hidden.bs.modal", function (e) {
  $("#confirmTitle").hide();
  $("#uploadTitle").show();
  $("#confirmBody").hide();
  $("#uploadBody").show();
  $("#yesButton").hide();
  $("#noButton").hide();
  $("#saveButton").show();
  $("#cancelButton").show();
  var input = document.querySelector('input[type="file"]');
  input.value = "";
});
function saveButtonClicked() {
  $("#uploadTitle").hide();
  $("#confirmTitle").show();
  $("#uploadBody").hide();
  $("#confirmBody").show();
  $("#saveButton").hide();
  $("#cancelButton").hide();
  $("#yesButton").show();
  $("#noButton").show();
}
function uploadTemplate() {
  let f = document.getElementById("uploadFile");
  var input = document.querySelector('input[type="file"]');
  var formData = new FormData();
  const urlParams = new URLSearchParams(window.location.search);
  const reportIndex = parseInt(urlParams.get("report"));
  const reportType =
    reportIndex == 1
      ? "Land Use Report"
      : reportIndex == 2
      ? "Notice of Final Review"
      : "";
  formData.append("file", input.files[0]);
  formData.append("document_type", reportType);
  formData.append("active_flag", false);
  formData.append("template_name", $("#uploadTemplateName").val());
  fetch("/admin/upload-template", {
    method: "POST",
    body: formData,
    responseType: "application/json",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors);
      } else {
        $("#uploadModal").modal("toggle");
        documentTable.ajax.reload();
      }
    });
}

/********************************
 * Add Provision Modal logic *
 ********************************/
function addProvision() {
  const type = $("#addProvisionType").find(":selected").val();
  const provision_group = $("#addProvisionGroup").val();
  const max = $("#addProvisionMaxUnlimited").is(":checked")
    ? 999
    : $("#addProvisionMax").val();
  const provision_group_text = $("#addProvisionGroupText").val();
  const provision_name = $("#addProvisionName").val();
  const free_text = $("#addProvisionFreeText").val();
  const help_text = $("#addProvisionHelpText").val();
  const category = $("#addProvisionCategory").val();
  const variantCheckboxes = document.querySelectorAll(".addProvisionVariant");
  const variants = [];
  variantCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      variants.push(checkbox.dataset.id);
    }
  });
  // const mandatory = $("#addProvisionMandatory").is(":checked");
  const data = JSON.stringify({
    type: type,
    provision_group: provision_group,
    max: max,
    provision_name: provision_name,
    provision_group_text: provision_group_text,
    free_text: free_text,
    help_text: help_text,
    category: category,
    variants: variants,
    // mandatory: mandatory,
  });
  const matchingRow = $("#groupMaxTable")
    .find("tr td:first-child")
    .filter(function () {
      return $(this).text() === provision_group;
    })
    .closest("tr");
  if (matchingRow.length) {
    const maxCellValue = +matchingRow.find("td:eq(1)").text();
    const groupTextCellValue = matchingRow.find("td:eq(2)").text();
    if (maxCellValue === max && groupTextCellValue == provision_group_text) {
      fetch("admin/add-provision", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((res) => res.json())
        .then(() => {
          groupMaxTable.ajax.reload();
          provisionTable.ajax.reload();
        });
      $("#addProvisionModal").modal("toggle");
    } else {
      if (maxCellValue != max && groupTextCellValue != provision_group_text) {
        $("#addGroupConfirmationText").text(
          `This will change the maximum number of provisions and description for group ${provision_group}.`
        );
      } else if (maxCellValue != max) {
        $("#addGroupConfirmationText").text(
          `This will change the maximum number of provisions for group ${provision_group}.`
        );
      } else {
        $("#addGroupConfirmationText").text(
          `This will change the description for group ${provision_group}.`
        );
      }
      showAddConfirm();
    }
  } else {
    fetch("admin/add-provision", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        groupMaxTable.ajax.reload();
        provisionTable.ajax.reload();
      });
    $("#addProvisionModal").modal("toggle");
  }
}
function confirmAddProvision() {
  const type = $("#addProvisionType").find(":selected").val();
  const provision_group = $("#addProvisionGroup").val();
  const provision_group_text = $("#addProvisionGroupText").val();
  const max = $("#addProvisionMaxUnlimited").is(":checked")
    ? 999
    : $("#addProvisionMax").val();
  const provision_name = $("#addProvisionName").val();
  const free_text = $("#addProvisionFreeText").val();
  const help_text = $("#addProvisionHelpText").val();
  const category = $("#addProvisionCategory").val();
  const variantCheckboxes = document.querySelectorAll(".addProvisionVariant");
  const variants = [];
  variantCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      variants.push(checkbox.dataset.id);
    }
  });
  // const mandatory = $("#addProvisionMandatory").is(":checked");
  const data = JSON.stringify({
    type: type,
    provision_group: provision_group,
    provision_group_text: provision_group_text,
    max: max,
    provision_name: provision_name,
    free_text: free_text,
    help_text: help_text,
    category: category,
    variants: variants,
    // mandatory: mandatory,
  });
  fetch("admin/add-provision", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((res) => res.json())
    .then(() => {
      groupMaxTable.ajax.reload();
      provisionTable.ajax.reload();
      $("#addProvisionModal").modal("toggle");
    });
}
function addProvisionGoBack() {
  hideAddConfirm();
}
// make sure add provision integer inputs only accept integers positive integers
$("#addProvisionMax").on("input", function () {
  var value = $(this).val();
  value = value.replace(/[^0-9]/g, "");
  $(this).val(value);
});
$("#addProvisionMaxUnlimited").on("change", function () {
  if ($(this).is(":checked")) {
    $("#addProvisionMax").val("");
    $("#addProvisionMax").prop("readonly", true);
    $("#addProvisionMax").addClass("input-readonly");
  } else {
    $("#addProvisionMax").prop("readonly", false);
    $("#addProvisionMax").removeClass("input-readonly");
  }
});
// auto-update the maximum value based on the selected group
$("#addProvisionGroup").on("input", function () {
  var value = $(this).val();
  value = value.replace(/[^0-9]/g, "");
  $(this).val(value);
  const groupMaxTable = $("#groupMaxTable");
  const matchingRow = groupMaxTable
    .find("tr td:first-child")
    .filter(function () {
      return $(this).text() === value;
    })
    .closest("tr");
  if (matchingRow.length) {
    const maxCellValue = +matchingRow.find("td:eq(1)").text();
    const groupTextCellValue = matchingRow.find("td:eq(2)").text();
    if (maxCellValue == 999) {
      $("#addProvisionMax").val("");
      $("#addProvisionMaxUnlimited").prop("checked", true);
      $("#addProvisionMax").prop("readonly", true);
      $("#addProvisionMax").addClass("input-readonly");
    } else {
      $("#addProvisionMax").val(maxCellValue);
      $("#addProvisionMaxUnlimited").prop("checked", false);
      $("#addProvisionMax").prop("readonly", false);
      $("#addProvisionMax").removeClass("input-readonly");
    }
    $("#addProvisionGroupText").val(groupTextCellValue);
  } else {
    $("#addProvisionMax").val("");
  }
});
$("#addProvisionModal").on("hidden.bs.modal", function () {
  $(this).find("input").val("");
  hideAddConfirm();
});
function hideAddConfirm() {
  $("#addProvisionDiv").show();
  $("#addProvisionFooter").show();
  $("#addProvisionConfirmationDiv").hide();
  $("#addProvisionConfirmationFooter").hide();
}
function showAddConfirm() {
  $("#addProvisionDiv").hide();
  $("#addProvisionFooter").hide();
  $("#addProvisionConfirmationDiv").show();
  $("#addProvisionConfirmationFooter").show();
}

/*********************************
 * Edit Provision Modal logic *
 *********************************/
function openEditModal() {
  const provisionId = $(this).data("id");
  const type = $(`#type-${provisionId}`).val();
  const provision_group = $(`#provision_group-${provisionId}`).val();
  const max = $(`#max-${provisionId}`).val();
  const provision_name = $(`#provision_name-${provisionId}`).val();
  const free_text = $(`#free_text-${provisionId}`).val();
  const help_text = $(`#help_text-${provisionId}`).val();
  const category = $(`#category-${provisionId}`).val();
  const variants = $(this).data("variants");
  const mandatory = $(this).data("mandatory");

  let provision_group_text = "";
  const matchingRow = $("#groupMaxTable")
    .find("tr td:first-child")
    .filter(function () {
      return $(this).text() === provision_group;
    })
    .closest("tr");
  if (matchingRow.length) {
    provision_group_text = matchingRow.find("td:eq(2)").text();
  }

  $("#editProvisionId").val(provisionId);
  const editProvisionType = document.getElementById("editProvisionType");
  for (let i = 0; i < editProvisionType.options.length; i++) {
    const option = editProvisionType.options[i];
    if (option.value === type) {
      option.selected = true;
      break;
    }
  }
  $("#editProvisionGroup").val(provision_group);
  $("#editProvisionGroupText").val(provision_group_text);
  if (max == "-") {
    $("#editProvisionMax").val("");
    $("#editProvisionMaxUnlimited").prop("checked", true);
    $("#editProvisionMax").prop("readonly", true);
    $("#editProvisionMax").addClass("input-readonly");
  } else {
    $("#editProvisionMax").val(max);
    $("#editProvisionMaxUnlimited").prop("checked", false);
    $("#editProvisionMax").prop("readonly", false);
    $("#editProvisionMax").removeClass("input-readonly");
  }
  $("#editProvisionName").val(provision_name);
  $("#editProvisionFreeText").val(free_text);
  $("#editProvisionHelpText").val(help_text);
  $("#editProvisionCategory").val(category);
  const variantCheckboxes = document.querySelectorAll(".editProvisionVariant");
  variantCheckboxes.forEach((checkbox) => {
    const variantId = parseInt(checkbox.dataset.id);
    if (variants.includes(variantId)) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  });
  $("#editProvisionMandatory").prop("checked", mandatory);
  $("#editProvisionModal").modal("toggle");
}
function editProvision() {
  const id = $("#editProvisionId").val();
  const type = $("#editProvisionType").find(":selected").val();
  const provision_group = $("#editProvisionGroup").val();
  const provision_group_text = $("#editProvisionGroupText").val();
  const max = $("#editProvisionMaxUnlimited").is(":checked")
    ? 999
    : $("#editProvisionMax").val();
  const provision_name = $("#editProvisionName").val();
  const free_text = $("#editProvisionFreeText").val();
  const help_text = $("#editProvisionHelpText").val();
  const category = $("#editProvisionCategory").val();
  const variantCheckboxes = document.querySelectorAll(".editProvisionVariant");
  const variants = [];
  variantCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      variants.push(checkbox.dataset.id);
    }
  });
  // const mandatory = $("#editProvisionMandatory").is(":checked");
  const data = JSON.stringify({
    id: id,
    type: type,
    provision_group: provision_group,
    provision_group_text: provision_group_text,
    max: max,
    provision_name: provision_name,
    free_text: free_text,
    help_text: help_text,
    category: category,
    variants: variants,
    // mandatory: mandatory,
  });
  const matchingRow = $("#groupMaxTable")
    .find("tr td:first-child")
    .filter(function () {
      return $(this).text() === provision_group;
    })
    .closest("tr");
  if (matchingRow.length) {
    const maxCellValue = +matchingRow.find("td:eq(1)").text();
    const groupTextCellValue = matchingRow.find("td:eq(2)").text();
    if (maxCellValue == max && provision_group_text == groupTextCellValue) {
      fetch("admin/update-provision", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((res) => res.json())
        .then(() => {
          groupMaxTable.ajax.reload();
          provisionTable.ajax.reload();
          $("#editProvisionModal").modal("toggle");
        });
    } else {
      if (maxCellValue != max && groupTextCellValue != provision_group_text) {
        $("#editGroupConfirmationText").text(
          `This will change the maximum number of provisions and description for group ${provision_group}.`
        );
      } else if (maxCellValue != max) {
        $("#editGroupConfirmationText").text(
          `This will change the maximum number of provisions for group ${provision_group}.`
        );
      } else {
        $("#editGroupConfirmationText").text(
          `This will change the description for group ${provision_group}.`
        );
      }
      showEditConfirm();
    }
  } else {
    fetch("admin/update-provision", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        groupMaxTable.ajax.reload();
        provisionTable.ajax.reload();
      });
    $("#editProvisionModal").modal("toggle");
  }
}
function confirmEditProvision() {
  const id = $("#editProvisionId").val();
  const type = $("#editProvisionType").find(":selected").val();
  const provision_group = $("#editProvisionGroup").val();
  const provision_group_text = $("#editProvisionGroupText").val();
  const max = $("#editProvisionMaxUnlimited").is(":checked")
    ? 999
    : $("#editProvisionMax").val();
  const provision_name = $("#editProvisionName").val();
  const free_text = $("#editProvisionFreeText").val();
  const help_text = $("#editProvisionHelpText").val();
  const category = $("#editProvisionCategory").val();
  const variantCheckboxes = document.querySelectorAll(".editProvisionVariant");
  const variants = [];
  variantCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      variants.push(checkbox.dataset.id);
    }
  });
  // const mandatory = $("#editProvisionMandatory").is(":checked");
  const data = JSON.stringify({
    id: id,
    type: type,
    provision_group: provision_group,
    provision_group_text: provision_group_text,
    max: max,
    provision_name: provision_name,
    free_text: free_text,
    help_text: help_text,
    category: category,
    variants: variants,
    // mandatory: mandatory,
  });
  fetch("admin/update-provision", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((res) => res.json())
    .then(() => {
      groupMaxTable.ajax.reload();
      provisionTable.ajax.reload();
    });
  $("#editProvisionModal").modal("toggle");
  hideEditConfirm();
}
function editProvisionGoBack() {
  hideEditConfirm();
}
// make sure add provision integer inputs only accept integers positive integers
$("#editProvisionMax").on("input", function () {
  var value = $(this).val();
  value = value.replace(/[^0-9]/g, "");
  $(this).val(value);
});
$("#editProvisionMaxUnlimited").on("change", function () {
  if ($(this).is(":checked")) {
    $("#editProvisionMax").val("");
    $("#editProvisionMax").prop("readonly", true);
    $("#editProvisionMax").addClass("input-readonly");
  } else {
    $("#editProvisionMax").prop("readonly", false);
    $("#editProvisionMax").removeClass("input-readonly");
  }
});
// auto-update the maximum value based on the selected group
$("#editProvisionGroup").on("input", function () {
  var value = $(this).val();
  value = value.replace(/[^0-9]/g, "");
  $(this).val(value);
  const groupMaxTable = $("#groupMaxTable");
  const matchingRow = groupMaxTable
    .find("tr td:first-child")
    .filter(function () {
      return $(this).text() === value;
    })
    .closest("tr");
  if (matchingRow.length) {
    const maxCellValue = +matchingRow.find("td:eq(1)").text();
    const groupTextCellValue = matchingRow.find("td:eq(2)").text();
    $("#editProvisionGroupText").val(groupTextCellValue);
    if (maxCellValue == 999) {
      $("#editProvisionMax").val("");
      $("#editProvisionMaxUnlimited").prop("checked", true);
      $("#editProvisionMax").prop("readonly", true);
      $("#editProvisionMax").addClass("input-readonly");
    } else {
      $("#editProvisionMax").val(maxCellValue);
      $("#editProvisionMaxUnlimited").prop("checked", false);
      $("#editProvisionMax").prop("readonly", false);
      $("#editProvisionMax").removeClass("input-readonly");
    }
  } else {
    $("#editProvisionMax").val("");
  }
});
$("#editProvisionModal").on("hidden.bs.modal", function () {
  $(this).find("input").val("");
  hideEditConfirm();
});
function hideEditConfirm() {
  $("#editProvisionDiv").show();
  $("#editProvisionFooter").show();
  $("#editProvisionConfirmationDiv").hide();
  $("#editProvisionConfirmationFooter").hide();
}
function showEditConfirm() {
  $("#editProvisionDiv").hide();
  $("#editProvisionFooter").hide();
  $("#editProvisionConfirmationDiv").show();
  $("#editProvisionConfirmationFooter").show();
}

/***********************
 * File Upload logic *
 ***********************/
const streamToText = async (blob) => {
  const readableStream = await blob.getReader();
  const chunk = await readableStream.read();

  return new TextDecoder("utf-8").decode(chunk.value);
};
const bufferToText = (buffer) => {
  const bufferByteLength = buffer.byteLength;
  const bufferUint8Array = new Uint8Array(buffer, 0, bufferByteLength);

  return new TextDecoder().decode(bufferUint8Array);
};
document.getElementById("uploadFile").addEventListener("change", function (e) {
  let fileBase64;
  $("#saveButton").prop("disabled", false);
  $("#uploadTemplateName").prop("disabled", false);
  let file = document.getElementById("uploadFile").files[0];
  if (file.name) {
    $("#uploadTemplateName").val(file.name.replace(".docx", ""));
  }
  (async () => {
    const fileContent = await file.text();
    const fileContentStream = await file.stream();
    const buffer = await file.arrayBuffer();
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      fileBase64 = reader.result.split("base64,")[1];
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  })();
});
