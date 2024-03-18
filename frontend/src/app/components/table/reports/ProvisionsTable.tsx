import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getDocumentProvisionsByDocTypeIdDtid } from '../../../common/report';
import { ProvisionData } from '../../../content/display/Provisions';
import { DocType } from '../../../types/types';

interface ProvisionsTableProps {
  dtid: number;
  docType: DocType;
  currentGroupNumber: number | null;
  currentGroupMax: number | null;
  selectedProvisionIds: number[] | undefined;
  selectProvision: (id: number, checked: boolean) => void;
}

const ProvisionsTable: React.FC<ProvisionsTableProps> = ({
  dtid,
  docType,
  currentGroupNumber,
  currentGroupMax,
  selectedProvisionIds,
  selectProvision,
}) => {
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<ProvisionData[]>([]); // provisions in the currently selected group
  const [currentGroupProvisions, setCurrentGroupProvisions] = useState<ProvisionData[]>([]);

  // get data
  useEffect(() => {
    const fetchData = async () => {
      setAllProvisions(await getDocumentProvisionsByDocTypeIdDtid(docType.id, dtid));
    };

    fetchData();
  }, [dtid, docType, currentGroupNumber]);

  // filter based on current group
  useEffect(() => {
    let filtered = allProvisions.filter((provision) => provision.provision_group === currentGroupNumber);
    setFilteredProvisions(filtered);
  }, [allProvisions, currentGroupNumber]);

  // xor logic for the two provisions which can't be selected at the same time.
  const isCheckboxDisabled = (provisionId: number, provisionName: string): boolean => {
    const exclusiveProvisionNames = [
      'ESTIMATED MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED',
      'MONIES PAYABLE - NOTICE OF FINAL REVIEW - DELAYED',
    ];
    // check if the current provision is one of the two xor ones
    if (exclusiveProvisionNames.includes(provisionName)) {
      // if so, check if the other provision is already selected
      const otherName = exclusiveProvisionNames.find((name) => name !== provisionName);
      const otherProvision = allProvisions.find((provision) => provision.provision_name === otherName);
      if (otherProvision) return selectedProvisionIds?.includes(otherProvision?.id) ?? false;
    }

    const selectedInGroup = filteredProvisions.filter((provision) =>
      selectedProvisionIds?.includes(provision.id)
    ).length;
    if (
      currentGroupMax !== null &&
      selectedInGroup >= currentGroupMax &&
      !selectedProvisionIds?.includes(provisionId)
    ) {
      return true; // Disable checkbox if not selected and group max reached
    }
    return false;
  };

  const columnHelper = createColumnHelper<ProvisionData>();
  const columns: ColumnDef<ProvisionData, any>[] = [
    columnHelper.accessor('type', {
      id: 'type',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Type',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Provision',
      meta: { customCss: { width: '45%' } },
    }),
    columnHelper.accessor('help_text', {
      id: 'help_text',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Help',
      meta: { customCss: { width: '45%' } },
    }),
    columnHelper.accessor('select', {
      id: 'select',
      cell: (info) => (
        <input
          type="checkbox"
          onChange={(e) => {
            if (!isCheckboxDisabled(info.row.original.id, info.row.original.provision_name)) {
              selectProvision(info.row.original.id, e.target.checked);
            }
          }}
          checked={selectedProvisionIds?.includes(info.row.original.id) ?? false}
          disabled={isCheckboxDisabled(info.row.original.id, info.row.original.provision_name)}
          style={{ width: '100%' }}
        />
      ),
      header: () => null,
      meta: { customCss: { width: '5%' } },
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
