import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { disableProvision, enableProvision } from '../../../common/manage-templates';
import { Provision, Variable } from '../../../types/types';
import LinkButton from '../../common/LinkButton';

interface ManageProvisionsTableProps {
  provisions: Provision[] | undefined;
  variables: Variable[] | undefined;
  editProvisionHandler: (provision: Provision, variables: Variable[]) => void;
  removeProvisionHandler: (provision: Provision) => void;
}

const ManageProvisionsTable: React.FC<ManageProvisionsTableProps> = ({
  provisions,
  variables,
  editProvisionHandler,
  removeProvisionHandler,
}) => {
  const [allProvisions, setProvisions] = useState<Provision[]>([]);
  const [allVariables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (provisions) {
      const sortedData = basicSort(provisions);
      setProvisions(sortedData);
    }
    if (variables) {
      setVariables(variables);
    }
  }, [provisions, variables]);

  // will add column sorting to table later
  const basicSort = (data: Provision[]): Provision[] => {
    const sortedData: Provision[] = [...data];
    sortedData.sort((a, b) => {
      if (a.active_flag === false && b.active_flag === true) return 1;
      if (a.active_flag === true && b.active_flag === false) return -1;
      if (a.provision_group < b.provision_group) return -1;
      if (a.provision_group > b.provision_group) return 1;
      return a.provision_name.localeCompare(b.provision_name);
    });
    return sortedData;
  };

  const activeRadioHandler = async (provisionId: number, newValue: boolean) => {
    try {
      setLoading(true);
      if (newValue) {
        await enableProvision(provisionId);
      } else {
        await disableProvision(provisionId);
      }
      setProvisions((prevProvisions) => {
        let newProvisions = prevProvisions.map((provision) => {
          if (provision.id === provisionId) {
            return { ...provision, active_flag: newValue };
          }
          return provision;
        });

        // Apply the sorting function directly here to ensure newProvisions is sorted before setting state
        return basicSort([...newProvisions]); // Make sure basicSort returns the sorted array
      });
    } catch (error) {
      console.log('Error enabling/disabling provision');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openEditProvisionModal = async (provisionId: number) => {
    const selectedProvision = allProvisions ? allProvisions.find((p) => p.id === provisionId) : undefined;
    const selectedVariables = allVariables ? allVariables.filter((v) => v.provision_id === provisionId) : undefined;
    if (selectedProvision && selectedVariables) editProvisionHandler(selectedProvision, selectedVariables);
  };

  const openRemoveProvisionModal = async (provision: Provision) => {
    const selectedProvision = allProvisions ? allProvisions.find((p) => p.id === provision.id) : undefined;
    if (selectedProvision) removeProvisionHandler(selectedProvision);
  };

  const columnHelper = createColumnHelper<Provision>();

  const columns: ColumnDef<Provision, any>[] = [
    columnHelper.accessor('id', {
      id: 'id',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'ID',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_group', {
      id: 'provision_group',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Group',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Provision',
      meta: { customCss: { width: '35%' } },
    }),
    columnHelper.accessor('category', {
      id: 'category',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Category',
      meta: { customCss: { width: '20%' } },
    }),
    columnHelper.accessor('active_flag', {
      id: 'active_flag',
      cell: (info) => (
        <CheckboxCell
          provisionId={info.row.original.id}
          initialValue={info.getValue()}
          onChange={activeRadioHandler}
          loading={loading}
        />
      ),
      header: () => 'Active',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.display({
      id: 'edit',
      cell: (info) => <LinkButton text="Edit" onClick={() => openEditProvisionModal(info.row.original.id)} />,
      header: () => null,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.display({
      id: 'remove',
      cell: (info) => <LinkButton text="Remove" onClick={() => openRemoveProvisionModal(info.row.original)} />,
      header: () => null,
      meta: { customCss: { width: '5%' } },
    }),
  ];

  return <DataTable columns={columns} data={allProvisions} />;
};

interface CheckboxCellProps {
  provisionId: number;
  initialValue: boolean;
  onChange: (id: number, newChecked: boolean) => Promise<void>;
  loading: boolean;
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({ provisionId, initialValue, onChange, loading }) => {
  const [checked, setChecked] = useState<boolean>(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    onChange(provisionId, newChecked);
  };

  return (
    <input type="checkbox" checked={checked} onChange={handleChange} disabled={loading} style={{ width: '100%' }} />
  );
};

export default ManageProvisionsTable;
