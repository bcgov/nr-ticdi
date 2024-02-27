import React, { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getAdminData } from '../../common/admin';

export type ProvisionData = {
  name: string;
  username: string;
  email: string;
  remove: string;
  idirUsername: string;
};

interface AdminDataTableProps {
  provisionData: ProvisionData[];
  currentGroupNumber: number;
  selectedProvisionIds: number[];
}

const AdminDataTable: React.FC<AdminDataTableProps> = ({ provisionData, currentGroupNumber, selectedProvisionIds }) => {
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<ProvisionData[]>([]); // provisions in the currently selected group (main table display data)
  const [selectedProvisions, setSelectedProvisions] = useState<ProvisionData[]>([]); // all provisions that have been selected (selected provisions table display data & save data)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setFilteredProvisions(allProvisions.filter((provision) => provision.));
  //   };

  //   fetchData();
  // }, [currentGroupNumber]);

  // const columnHelper = createColumnHelper<AdminData>();

  // const columns: ColumnDef<AdminData, any>[] = [
  //   columnHelper.accessor('name', {
  //     id: 'name',
  //     cell: (info) => (
  //       <input value={info.getValue()} style={{ minWidth: '250px', marginTop: '10px', marginRight: '5px' }} disabled />
  //     ),
  //     header: () => 'Name',
  //     meta: { customCss: { minWidth: '250px', width: '250px' } },
  //   }),
  //   columnHelper.accessor('username', {
  //     id: 'username',
  //     cell: (info) => (
  //       <input value={info.getValue()} style={{ minWidth: '250px', marginTop: '10px', marginRight: '5px' }} disabled />
  //     ),
  //     header: () => 'User Name',
  //     meta: { customCss: { minWidth: '250px', width: '250px' } },
  //   }),
  //   columnHelper.accessor('email', {
  //     id: 'email',
  //     cell: (info) => (
  //       <input value={info.getValue()} style={{ minWidth: '250px', marginTop: '10px', marginRight: '5px' }} disabled />
  //     ),
  //     header: () => 'Email',
  //     meta: { customCss: { minWidth: '250px', width: '250px' } },
  //   }),
  //   columnHelper.accessor('remove', {
  //     id: 'remove',
  //     cell: (info) => (
  //       <button
  //         onClick={() => removeAdminButtonHandler(info.row.original)}
  //         style={{
  //           backgroundColor: 'transparent',
  //           color: 'blue',
  //           textDecoration: 'underline',
  //           border: 'none',
  //           cursor: 'pointer',
  //           padding: 0,
  //         }}
  //       >
  //         Remove
  //       </button>
  //     ),
  //     header: () => null,
  //     meta: { customCss: { minWidth: '80px', width: '80px' } },
  //   }),
  //   columnHelper.accessor('idirUsername', {
  //     id: 'idirUsername',
  //     cell: () => null,
  //     header: () => null,
  //     meta: { customCss: { display: 'none' } },
  //   }),
  // ];

  return <DataTable columns={[]} data={filteredProvisions} />;
};

export default AdminDataTable;
