import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ReducedProvisionDataObject } from '../../../types/types';

interface ProvisionsTableProps {
  currentGroupNumber: number | null;
  currentGroupMax: number | null;
  selectedProvisionIds: number[] | undefined;
  provisions: ReducedProvisionDataObject[] | undefined;
  selectProvision: (id: number, checked: boolean) => void;
}

const ProvisionsTable: React.FC<ProvisionsTableProps> = ({
  currentGroupNumber,
  currentGroupMax,
  selectedProvisionIds,
  provisions,
  selectProvision,
}) => {
  const [allProvisions, setAllProvisions] = useState<ReducedProvisionDataObject[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<ReducedProvisionDataObject[]>([]); // provisions in the currently selected group

  useEffect(() => {
    if (provisions) setAllProvisions(provisions);
  }, [provisions]);

  // filter based on current group
  useEffect(() => {
    if (allProvisions && currentGroupNumber) {
      const filtered = allProvisions.filter(
        (provision) => provision.provision_group && provision.provision_group.provision_group === currentGroupNumber
      );
      setFilteredProvisions(filtered);
    }
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
      if (otherProvision) return selectedProvisionIds?.includes(otherProvision?.provision_id) ?? false;
    }

    const selectedInGroup = filteredProvisions.filter((provision) =>
      selectedProvisionIds?.includes(provision.provision_id)
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

  const columnHelper = createColumnHelper<ReducedProvisionDataObject>();
  const columns: ColumnDef<ReducedProvisionDataObject, any>[] = [
    columnHelper.accessor('type', {
      id: 'type',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Type',
      enableSorting: true,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Provision',
      enableSorting: true,
      meta: { customCss: { width: '45%' } },
    }),
    columnHelper.accessor('help_text', {
      id: 'help_text',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Help',
      enableSorting: false,
      meta: { customCss: { width: '45%' } },
    }),
    columnHelper.display({
      id: 'select',
      cell: (info) => (
        <input
          type="checkbox"
          onChange={(e) => {
            if (!isCheckboxDisabled(info.row.original.provision_id, info.row.original.provision_name)) {
              selectProvision(info.row.original.provision_id, e.target.checked);
            }
          }}
          checked={selectedProvisionIds?.includes(info.row.original.provision_id) ?? false}
          disabled={isCheckboxDisabled(info.row.original.provision_id, info.row.original.provision_name)}
          style={{ width: '100%' }}
        />
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '5%' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredProvisions}
      enableSorting={true}
      initialSorting={[{ id: 'provision_name', desc: false }]}
    />
  );
};

export default ProvisionsTable;
