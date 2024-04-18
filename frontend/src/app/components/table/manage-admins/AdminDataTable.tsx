import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getAdminData } from '../../../common/manage-admins';

export type AdminData = {
  name: string;
  username: string;
  email: string;
  remove: string;
  idirUsername: string;
};

interface AdminDataTableProps {
  searchTerm: string;
  removeAdminModalHandler: (admin: AdminData) => void;
}

const AdminDataTable: React.FC<AdminDataTableProps> = ({ searchTerm, removeAdminModalHandler }) => {
  const [adminData, setAdminData] = useState<AdminData[]>([]);
  const [filteredAdminData, setFilteredAdminData] = useState<AdminData[]>([]);

  const removeAdminButtonHandler = (admin: AdminData) => {
    removeAdminModalHandler(admin);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAdminData();
      setAdminData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (!searchTerm || searchTerm === '') {
        setFilteredAdminData(adminData);
        return;
      }
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      const filteredData = adminData.filter((item) =>
        (Object.keys(item) as (keyof AdminData)[]).some((key) =>
          String(item[key]).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );

      setFilteredAdminData(filteredData);
    };

    filterData();
  }, [searchTerm, adminData]);

  const columnHelper = createColumnHelper<AdminData>();

  const columns: ColumnDef<AdminData, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Name',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.accessor('username', {
      id: 'username',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'User Name',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.accessor('email', {
      id: 'email',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Email',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.accessor('remove', {
      id: 'remove',
      cell: (info) => (
        <button
          onClick={() => removeAdminButtonHandler(info.row.original)}
          style={{
            backgroundColor: 'transparent',
            color: 'blue',
            textDecoration: 'underline',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Remove
        </button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('idirUsername', {
      id: 'idirUsername',
      cell: () => null,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredAdminData}
      enableSorting={true}
      initialSorting={[{ id: 'name', desc: false }]}
    />
  );
};

export default AdminDataTable;
