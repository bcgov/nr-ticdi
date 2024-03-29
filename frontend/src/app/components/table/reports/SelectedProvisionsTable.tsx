import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DocType, ReducedProvisionDataObject } from '../../../types/types';

interface SelectedProvisionsTableTableProps {
  docType: DocType;
  selectedProvisionIds: number[] | undefined;
  provisions: ReducedProvisionDataObject[] | undefined;
}

export type SaveProvisionData = { provision_id: number; doc_type_provision_id: number };
export type ProvisionJson = {
  provision_id: number;
  doc_type_provision_id: number;
  provision_group: number;
  provision_name: string;
  free_text: string;
};

const SelectedProvisionsTable: React.FC<SelectedProvisionsTableTableProps> = ({
  docType,
  selectedProvisionIds,
  provisions,
}) => {
  const [allProvisions, setAllProvisions] = useState<ReducedProvisionDataObject[]>([]);
  const [selectedProvisions, setSelectedProvisions] = useState<ReducedProvisionDataObject[]>([]);

  useEffect(() => {
    if (provisions) setAllProvisions(provisions);
  }, [provisions]);

  // filter/sort allProvisions to find selected ones for displaying
  useEffect(() => {
    if (allProvisions) {
      console.log('selectedids');
      console.log(selectedProvisionIds);
      const filtered = allProvisions.filter((provision) => selectedProvisionIds?.includes(provision.provision_id));
      const filteredAndSorted: ReducedProvisionDataObject[] = [...filtered].sort((a, b) => {
        if (a.provision_group < b.provision_group) return -1;
        if (a.provision_group > b.provision_group) return 1;
        return a.provision_name.localeCompare(b.provision_name);
      });
      setSelectedProvisions(filteredAndSorted);
    }
  }, [allProvisions, selectedProvisionIds, docType]);

  const columnHelper = createColumnHelper<ReducedProvisionDataObject>();
  const columns: ColumnDef<ReducedProvisionDataObject, any>[] = [
    columnHelper.accessor('type', {
      id: 'type',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Type',
      enableSorting: true,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor((row) => row.provision_group.provision_group, {
      id: 'provision_group',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Group',
      enableSorting: true,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Provision',
      enableSorting: true,
      meta: { customCss: { width: '50%' } },
    }),
    columnHelper.accessor('category', {
      id: 'category',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Category',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={selectedProvisions}
      enableSorting={true}
      initialSorting={[
        { id: 'provision_group', desc: false },
        // { id: 'provision_name', desc: false },
      ]}
    />
  );
};

export default SelectedProvisionsTable;
