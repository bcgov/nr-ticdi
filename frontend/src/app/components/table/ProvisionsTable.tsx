import React, { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
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

interface ProvisionsTableTableProps {
  dtid: number;
  variant: string;
  currentGroupNumber: number | null;
  selectedProvisionIds: number[] | undefined;
  selectProvision: (id: number, checked: boolean) => void;
}

const ProvisionsTable: React.FC<ProvisionsTableTableProps> = ({
  dtid,
  variant,
  currentGroupNumber,
  selectedProvisionIds,
  selectProvision,
}) => {
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<ProvisionData[]>([]); // provisions in the currently selected group

  // get data
  useEffect(() => {
    const fetchData = async () => {
      setAllProvisions(await getNfrProvisionsByVariantDtid(variant, dtid));
    };

    fetchData();
  }, [dtid, variant, currentGroupNumber]);

  // filter based on current group
  useEffect(() => {
    const filtered = allProvisions.filter(
      (provision) =>
        provision.provision_group === currentGroupNumber &&
        provision.provision_variant.some((v) => v.variant_name.toUpperCase() === variant.toUpperCase())
    );
    setFilteredProvisions(filtered);
  }, [allProvisions, currentGroupNumber, variant]);

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
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '400px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Provision',
      meta: { customCss: { minWidth: '400px', width: '400px' } },
    }),
    columnHelper.accessor('help_text', {
      id: 'help_text',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '400px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Help',
      meta: { customCss: { minWidth: '400px', width: '400px' } },
    }),
    columnHelper.accessor('select', {
      id: 'select',
      cell: (info) => (
        <input
          type="checkbox"
          onChange={(e) => selectProvision(info.row.original.id, e.target.checked)}
          checked={selectedProvisionIds?.includes(info.row.original.id) ?? false}
        />
      ),
      header: () => null,
      meta: { customCss: { minWidth: '40px', width: '40px' } },
    }),
    columnHelper.accessor('id', {
      id: 'id',
      cell: () => null,
      header: () => null,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return <DataTable columns={columns} data={filteredProvisions} />;
};

export default ProvisionsTable;
