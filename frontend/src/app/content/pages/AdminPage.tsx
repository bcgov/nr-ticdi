import { FC, useState } from 'react';
import AddAdmin from '../../components/modal/manage-admins/AddAdmin';
import RemoveAdmin from '../../components/modal/manage-admins/RemoveAdmin';
import { exportUsers } from '../../common/manage-admins';
import AdminDataTable, { AdminData } from '../../components/table/manage-admins/AdminDataTable';

const AdminPage: FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTable, setRefreshTable] = useState(0);

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

  const exportUserListHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await exportUsers();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const refreshTableHandler = () => {
    setRefreshTable((prev) => prev + 1);
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
          <AdminDataTable
            searchTerm={searchTerm}
            removeAdminModalHandler={showRemoveAdminModalHandler}
            refreshTable={refreshTable}
          />
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

      {showAddAdminModal && (
        <AddAdmin show={showAddAdminModal} onHide={closeAddAdminModalHandler} refreshTable={refreshTableHandler} />
      )}
      {selectedAdmin && showRemoveAdminModal && (
        <RemoveAdmin
          admin={selectedAdmin}
          show={showRemoveAdminModal}
          onHide={closeRemoveAdminModalHandler}
          refreshTable={refreshTableHandler}
        />
      )}
    </>
  );
};
export default AdminPage;
