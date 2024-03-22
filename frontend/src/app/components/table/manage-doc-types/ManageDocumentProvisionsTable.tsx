import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  ManageDocTypeProvision,
  associateProvisionToDocType,
  disassociateProvisionFromDocType,
} from '../../../common/manage-doc-types';

interface ManageDocumentProvisionsTableProps {
  documentTypeId: number;
  provisions: ManageDocTypeProvision[] | undefined;
  refreshTables: () => void;
}

const ManageDocumentProvisionsTable: React.FC<ManageDocumentProvisionsTableProps> = ({
  documentTypeId,
  provisions,

  refreshTables,
}) => {
  const [allProvisions, setAllProvisions] = useState<ManageDocTypeProvision[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (provisions) {
      setAllProvisions(provisions);
    }
  }, [provisions]);

  const associateCheckboxHandler = async (provisionId: number, newValue: boolean) => {
    try {
      setLoading(true);
      if (newValue) {
        await associateProvisionToDocType(provisionId, documentTypeId);
      } else {
        await disassociateProvisionFromDocType(provisionId, documentTypeId);
      }
      setAllProvisions((prevProvisions) => {
        let newProvisions = prevProvisions.map((provision) => {
          if (provision.id === provisionId) {
            return { ...provision, associated: newValue };
          }
          return provision;
        });
        return newProvisions;
      });
    } catch (error) {
      console.log('Error enabling/disabling provision');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columnHelper = createColumnHelper<ManageDocTypeProvision>();

  const columns: ColumnDef<ManageDocTypeProvision, any>[] = [
    columnHelper.accessor('id', {
      id: 'id',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'ID',
      enableSorting: true,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('type', {
      id: 'type',
      cell: (info) => (
        <select defaultValue={info.getValue()} style={{ width: '100%' }}>
          <option value=""></option>
          <option value="O">O</option>
          <option value="M">M</option>
          <option value="B">B</option>
          <option value="V">V</option>
        </select>
      ),
      header: () => 'Type',
      enableSorting: true,
      meta: { customCss: { width: '7%' } },
    }),
    columnHelper.accessor((row) => row.provision_group.provision_group, {
      id: 'provision_group',
      cell: (info) => <input defaultValue={info.getValue()} style={{ width: '100%' }} />,
      header: () => 'Group',
      enableSorting: true,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('order_value', {
      id: 'order_value',
      cell: (info) => <input defaultValue={info.getValue()} style={{ width: '100%' }} />,
      header: () => 'Seq',
      enableSorting: false,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('provision_group', {
      id: 'provision_group_max',
      cell: (info) => <input defaultValue={info.getValue().max} className="readonlyInput" readOnly />,
      header: () => 'Max',
      enableSorting: false,
      meta: { customCss: { width: '6%' } },
    }),
    columnHelper.accessor('provision_name', {
      id: 'provision_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Provision',
      enableSorting: false,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.accessor('free_text', {
      id: 'free_text',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Free Text',
      enableSorting: true,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('category', {
      id: 'category',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Category',
      enableSorting: true,
      meta: { customCss: { width: '15%' } },
    }),
    columnHelper.accessor('associated', {
      id: 'associated',
      cell: (info) => (
        <CheckboxCell
          provisionId={info.row.original.id}
          initialValue={info.getValue()}
          onChange={associateCheckboxHandler}
          loading={loading}
        />
      ),
      header: () => 'Associated',
      enableSorting: true,
      meta: { customCss: { width: '10%' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={allProvisions}
      // paginationSetup={{ enabled: true, pageSize: 10 }}
      enableSorting={true}
      initialSorting={[
        { id: 'associated', desc: true },
        { id: 'provision_group', desc: false },
        // { id: 'provision_name', desc: false },
      ]}
    />
  );
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

export default ManageDocumentProvisionsTable;
