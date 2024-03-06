import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  disableProvision,
  enableProvision,
  getProvisions,
  getVariables,
  removeVariable,
} from '../../../common/manage-templates';
import { Provision, Variable } from '../../../types/types';

interface ManageProvisionsTableProps {
  refreshVersion: number;
  editProvisionHandler: (provision: Provision, variables: Variable[]) => void;
}

const ManageProvisionsTable: React.FC<ManageProvisionsTableProps> = ({ refreshVersion, editProvisionHandler }) => {
  const [provisions, setProvisions] = useState<Provision[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  // const [currentlyActiveProvision, setCurrentlyActiveProvision] = useState<Provision>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const provisionData: Provision[] = await getProvisions();
      const sortedData = basicSort(provisionData);
      setProvisions(sortedData);
      const variableData: Variable[] = await getVariables();
      setVariables(variableData);
    };

    fetchData();
  }, [refreshVersion]);

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

  // this opens a modal which is handled on the ManageTemplatesPage
  const handleRemoveVariable = async (variableId: number) => {
    await removeVariable(variableId);
  };

  const openEditProvisionModal = async (provisionId: number) => {
    const selectedProvision = provisions.find((p) => p.id === provisionId);
    const selectedVariables = variables.filter((v) => v.provision_id === provisionId);
    // setCurrentlyActiveProvision(selectedProvision);
    if (selectedProvision) editProvisionHandler(selectedProvision, selectedVariables);
  };

  const columnHelper = createColumnHelper<Provision>();

  const columns: ColumnDef<Provision, any>[] = [
    columnHelper.accessor('type', {
      id: 'type',
      cell: (info) => <input value={info.getValue()} style={{ width: '100%' }} readOnly />,
      header: () => 'Type',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_group', {
      id: 'provision_group',
      cell: (info) => <input value={info.getValue()} style={{ width: '100%' }} readOnly />,
      header: () => 'Group',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('max', {
      id: 'max',
      cell: (info) => <input value={info.getValue()} style={{ width: '100%' }} readOnly />,
      header: () => 'Max',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => <input value={info.getValue()} style={{ width: '100%' }} readOnly />,
      header: () => 'Provision',
      meta: { customCss: { width: '35%' } },
    }),
    columnHelper.accessor('free_text', {
      id: 'free_text',
      cell: (info) => <input value={info.getValue()} style={{ width: '100%' }} title={info.getValue()} readOnly />,
      header: () => 'Free Text',
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('category', {
      id: 'category',
      cell: (info) => <input value={info.getValue()} style={{ width: '100%' }} readOnly />,
      header: () => 'Category',
      meta: { customCss: { width: '25%' } },
    }),
    // add component that allows individual rendering
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
    columnHelper.accessor('edit', {
      id: 'edit',
      cell: (info) => (
        <a href="#" onClick={() => openEditProvisionModal(info.row.original.id)} style={{ width: '100%' }}>
          Edit
        </a>
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

  return <DataTable columns={columns} data={provisions} />;
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
