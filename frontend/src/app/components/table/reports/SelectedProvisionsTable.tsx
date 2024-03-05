import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getNfrProvisionsByVariantDtid } from '../../../common/report';
import { ProvisionData } from '../../../content/display/Provisions';

interface SelectedProvisionsTableTableProps {
  variant: string;
  dtid: number;
  selectedProvisionIds: number[] | undefined;
  updateHandler: (provisionJson: ProvisionJson[]) => void;
}

export type SaveProvisionData = { provision_id: number; free_text: string };
export type ProvisionJson = {
  provision_id: number;
  provision_group: number;
  provision_name: string;
  free_text: string;
};

const SelectedProvisionsTable: React.FC<SelectedProvisionsTableTableProps> = ({
  variant,
  dtid,
  selectedProvisionIds,
  updateHandler,
}) => {
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [selectedProvisions, setSelectedProvisions] = useState<ProvisionData[]>([]);

  // grab all provisions
  useEffect(() => {
    const fetchData = async () => {
      setAllProvisions(await getNfrProvisionsByVariantDtid(variant, dtid));
    };
    fetchData();
  }, [variant, dtid]);

  // filter/sort allProvisions to find selected ones for displaying
  useEffect(() => {
    if (allProvisions) {
      const filtered = allProvisions.filter((provision) => selectedProvisionIds?.includes(provision.id));
      const filteredAndSorted: ProvisionData[] = [...filtered].sort((a, b) => {
        if (a.provision_group < b.provision_group) return -1;
        if (a.provision_group > b.provision_group) return 1;
        return a.provision_name.localeCompare(b.provision_name);
      });
      setSelectedProvisions(filteredAndSorted);
    }
  }, [allProvisions, selectedProvisionIds, variant]);

  // update provision save data array in ReportPage when selectedProvisions changes
  useEffect(() => {
    const collectProvisionData = () => {
      const provisionJson: ProvisionJson[] = selectedProvisions.map((provision) => ({
        provision_id: provision.id,
        provision_group: provision.provision_group,
        provision_name: provision.provision_name,
        free_text: provision.free_text,
      }));

      updateHandler(provisionJson);
    };
    collectProvisionData();
  }, [selectedProvisions]);

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
