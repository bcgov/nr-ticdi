import { FC } from "react";
import "./modals.css";

const RemoveAdmin: FC = ({}) => {
  return (
    <>
      <div id="removeAdminModal" className="modal fade" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Remove Administrator</h4>
            </div>
            <div className="modal-body">
              <div id="removeAdminBody">
                <div className="form-group row">
                  <div className="col-md-12">
                    <p>Are you sure you want to remove this administrator?</p>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-2 ml-3">
                    <label htmlFor="removeName">Name:</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      id="removeName"
                      value=""
                      className="removeAdminInput"
                      readOnly
                    />
                  </div>
                  <div className="col-md-2 ml-3">
                    <label htmlFor="removeUsername">Username:</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      id="removeUsername"
                      value=""
                      className="removeAdminInput"
                      readOnly
                    />
                  </div>
                  <div className="col-md-2 ml-3">
                    <label htmlFor="removeEmail">Email:</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      id="removeEmail"
                      value=""
                      className="removeAdminInput"
                      readOnly
                    />
                  </div>
                </div>
                <input
                  id="removeIdirUsername"
                  value=""
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary remove-admin-finalize"
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveAdmin;
