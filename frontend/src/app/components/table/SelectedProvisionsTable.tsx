import React, { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getAdminData } from '../../common/admin';
import { getNfrProvisionsByVariantDtid } from '../../common/report';

export type ProvisionData = {
  type: string;
  provision_name: string;
  free_text: string;
  category: string;
  active_flag: boolean;
  create_userid: string;
  update_userid: string;
  provision_variant: [
    {
      id: number;
      variant_name: string;
    }
  ];
  id: number;
  help_text: string;
  create_timestamp: string;
  update_timestamp: string;
  select: boolean;
  max: number;
  provision_group: number;
};

interface SelectedProvisionsTableTableProps {
  variant: string;
  dtid: number;
  selectedProvisionIds: number[] | undefined;
}

const SelectedProvisionsTable: React.FC<SelectedProvisionsTableTableProps> = ({
  variant,
  dtid,
  selectedProvisionIds,
}) => {
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [selectedProvisions, setSelectedProvisions] = useState<ProvisionData[]>([]);

  // grab all provisions including free_text input by user
  useEffect(() => {
    const fetchData = async () => {
      setAllProvisions(await getNfrProvisionsByVariantDtid(variant, dtid));
    };
    fetchData();
  }, [variant, dtid]);

  // filter allProvisions to find selected ones for displaying
  useEffect(() => {
    if (allProvisions) {
      const filtered = allProvisions.filter((provision) => selectedProvisionIds?.includes(provision.id));
      setSelectedProvisions(filtered);
    }
  }, [allProvisions, selectedProvisionIds, variant]);

  const columnHelper = createColumnHelper<ProvisionData>();
  const columns: ColumnDef<ProvisionData, any>[] = [
    columnHelper.accessor('type', {
      id: 'type',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '50px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Type',
      meta: { customCss: { minWidth: '50px', width: '50px' } },
    }),
    columnHelper.accessor('provision_group', {
      id: 'provision_group',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '50px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Group',
      meta: { customCss: { minWidth: '50px', width: '50px' } },
    }),
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '500px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Provision',
      meta: { customCss: { minWidth: '500px', width: '500px' } },
    }),
    columnHelper.accessor('category', {
      id: 'category',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '120px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Category',
      meta: { customCss: { minWidth: '120px', width: '120px' } },
    }),
  ];

  return <DataTable columns={columns} data={selectedProvisions} />;
};

export default SelectedProvisionsTable;
