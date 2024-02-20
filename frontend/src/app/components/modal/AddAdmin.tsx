import { FC } from "react";

const AddAdmin: FC = ({}) => {
  const searchUsers = () => {};

  const addAdmin = () => {};

  return (
    <>
      <div id="addAdministratorModal" className="modal fade" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Administrator</h4>
            </div>
            <div className="modal-body">
              <div id="addAdministratorBody">
                <div className="form-group row mb-0">
                  <div className="col-md-6 ml-3">
                    <label htmlFor="searchEmail" style={{ fontWeight: "bold" }}>
                      Email:
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-10 ml-3">
                    <input
                      id="searchEmail"
                      value=""
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-4 ml-3">
                    <button
                      id="searchUsersButton"
                      className="btn btn-success"
                      onClick={() => searchUsers()}
                    >
                      Search
                    </button>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-6 ml-3">
                    <label
                      htmlFor="searchSurname"
                      style={{ fontWeight: "bold" }}
                    >
                      Surname:
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-10 ml-3">
                    <input
                      id="searchSurname"
                      value=""
                      style={{ width: "100%" }}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-6 ml-3">
                    <label
                      htmlFor="searchGivenName"
                      style={{ fontWeight: "bold" }}
                    >
                      Given Name 1:
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-10 ml-3">
                    <input
                      id="searchGivenName"
                      value=""
                      style={{ width: "100%" }}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-3 ml-3">
                    <label
                      htmlFor="searchUsername"
                      style={{ fontWeight: "bold" }}
                    >
                      Username:{" "}
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-10 ml-3">
                    <input
                      id="searchUsername"
                      value=""
                      style={{ width: "100%" }}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-6 ml-3">
                    <label htmlFor="searchRole" style={{ fontWeight: "bold" }}>
                      Role:
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-10 ml-3">
                    <select id="searchRole" style={{ width: "100%" }} disabled>
                      <option>TICDIADMIN</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-6 ml-3">
                    <label style={{ fontWeight: "bold" }}>Status:</label>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-1"></div>
                  <div className="col-md-6">
                    <label htmlFor="searchStatusActive">Active:</label>
                    <input
                      id="searchStatusActive"
                      type="radio"
                      name="adminStatus"
                      checked
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-1"></div>
                  <div className="col-md-6">
                    <label htmlFor="searchStatusInactive">Inactive:</label>
                    <input
                      id="searchStatusInactive"
                      type="radio"
                      name="adminStatus"
                      disabled
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="alert alert-danger modal-alert"
                    style={{ display: "none" }}
                  ></div>
                </div>
              </div>
              <input
                id="searchIdirUsername"
                style={{ display: "none" }}
                value=""
              />
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                id="addAdminButton"
                type="button"
                className="btn btn-primary"
                onClick={() => addAdmin()}
                disabled
              >
                Add Administrator
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddAdmin;
