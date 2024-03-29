import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getDocumentProvisionsByDocTypeIdDtid } from '../../../common/report';
import { ProvisionData } from '../../../content/display/Provisions';
import { DocType } from '../../../types/types';

interface SelectedProvisionsTableTableProps {
  docType: DocType;
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
  docType,
  dtid,
  selectedProvisionIds,
  updateHandler,
}) => {
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [selectedProvisions, setSelectedProvisions] = useState<ProvisionData[]>([]);

  // grab all provisions
  useEffect(() => {
    const fetchData = async () => {
      const provisionData: { provisions: ProvisionData[]; provisionIds: number[] } =
        await getDocumentProvisionsByDocTypeIdDtid(docType.id, dtid);
      setAllProvisions(provisionData.provisions);
    };
    fetchData();
  }, [docType, dtid]);

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
  }, [allProvisions, selectedProvisionIds, docType]);

  // update provision save data array in ReportPage when selectedProvisions changes
  useEffect(() => {
    const collectProvisionData = () => {
      const provisionJson: ProvisionJson[] = selectedProvisions.map((provision) => ({
        provision_id: provision.id,
        provision_group: provision.provision_group.provision_group,
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
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Type',
      enableSorting: true,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_group', {
      id: 'provision_group',
      cell: (info) => <input value={info.getValue().provision_group} className="readonlyInput" readOnly />,
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
        { id: 'provision_group', desc: false }, // unsure if this will be seen as an object, may need to map the data beforehand
        { id: 'provision_name', desc: false },
      ]}
    />
  );
};

export default SelectedProvisionsTable;
