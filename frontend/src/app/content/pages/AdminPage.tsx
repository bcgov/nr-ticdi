import { FC, useState } from 'react';
// import { REPORT_TYPES } from '../../util/constants';
import AddAdmin from '../../components/modal/admin/manage-admins/AddAdmin';
import RemoveAdmin from '../../components/modal/admin/manage-admins/RemoveAdmin';
// import { useNavigate } from 'react-router-dom';
import { exportUsers } from '../../common/admin';
import AdminDataTable, { AdminData } from '../../components/table/admin/AdminDataTable';

const AdminPage: FC = () => {
  // const navigate = useNavigate();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = useState(false);
  // const [selectedReport, setSelectedReport] = useState('0');
  const [searchTerm, setSearchTerm] = useState('');

  const showAddAdminModalHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowAddAdminModal(true);
  };
  const showRemoveAdminModalHandler = (admin: AdminData) => {
    setSelectedAdmin(admin);
    setShowRemoveAdminModal(true);
  };
  const closeAddAdminModalHandler = () => {
    setShowAddAdminModal(false);
  };
  const closeRemoveAdminModalHandler = () => {
    setShowRemoveAdminModal(false);
  };

  // const selectedReportHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedReport(event.target.value);
  // };

  const exportUserListHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await exportUsers();
  };

  // const manageReportsHandler = () => {
  //   navigate(`/manage-templates/${selectedReport}`);
  // };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <h1>Manage Administrators</h1>
      <hr />
      <div className="form-group row d-flex justify-content-between align-items-center">
        <h3 className="ml-3">List of TICDI Administrators</h3>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          style={{ maxWidth: '300px' }} // Use maxWidth instead of width for responsiveness
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="form-group row">
        <div className="col-md-12">
          <AdminDataTable searchTerm={searchTerm} removeAdminModalHandler={showRemoveAdminModalHandler} />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-md-7"></div>
        <div className="col-md-2">
          <button
            id="exportUserList"
            className="btn btn-info"
            onClick={exportUserListHandler}
            style={{ backgroundColor: 'teal', color: 'white' }}
          >
            Export User List
          </button>
        </div>
        <div className="col-md-3">
          <button id="addAdministrator" className="btn btn-primary" onClick={showAddAdminModalHandler}>
            Add Administrator
          </button>
        </div>
      </div>
      {/* <hr />
      <div className="col-md-3">
        <h3>Manage Templates</h3>
      </div>
      <div className="col-md-3">
        <h4>Select a Template:</h4>
      </div>
      <div className="form-group row">
        <div className="col-md-4">
          <select
            id="reportTypes"
            style={{ minWidth: '200px' }}
            className="border border-1 rounded pl-2 ml-4"
            value={selectedReport}
            onChange={selectedReportHandler}
          >
            {REPORT_TYPES.map((report) => (
              <option key={report.reportIndex} value={report.reportIndex}>
                {report.reportType}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button
            id="manageButton"
            className="btn"
            onClick={manageReportsHandler}
            style={{ backgroundColor: 'purple', color: 'white' }}
          >
            Manage
          </button>
        </div>
      </div> */}
      {showAddAdminModal && <AddAdmin show={showAddAdminModal} onHide={closeAddAdminModalHandler} />}
      {selectedAdmin && showRemoveAdminModal && (
        <RemoveAdmin admin={selectedAdmin} show={showRemoveAdminModal} onHide={closeRemoveAdminModalHandler} />
      )}
    </>
  );
};
export default AdminPage;
