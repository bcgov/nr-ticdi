import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Variable } from '../../../types/types';
import LinkButton from '../../common/LinkButton';

interface ManageVariablesTableProps {
  variables: Variable[];
  onDisplayEdit: (variableId: number) => void;
  onDisplayRemove: (variableId: number) => void;
}

const ManageVariablesTable: React.FC<ManageVariablesTableProps> = ({ variables, onDisplayEdit, onDisplayRemove }) => {
  const [sortedVariables, setSortedVariables] = useState<Variable[]>(variables);

  useEffect(() => {
    const fetchData = () => {
      const sortedData: Variable[] = basicSort(variables);
      setSortedVariables(sortedData);
    };

    fetchData();
  }, [variables]);

  // will add column sorting to table later
  const basicSort = (data: Variable[]): Variable[] => {
    const sortedData: Variable[] = [...data];
    sortedData.sort((a, b) => {
      return a.variable_name.localeCompare(b.variable_name);
    });
    return sortedData;
  };

  const displayRemoveVariable = (variableId: number) => {
    onDisplayRemove(variableId);
  };

  const displayEditVariable = async (variableId: number) => {
    onDisplayEdit(variableId);
  };

  const columnHelper = createColumnHelper<Variable>();

  const columns: ColumnDef<Variable, any>[] = [
    columnHelper.accessor('variable_name', {
      id: 'variable_name',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Name',
      enableSorting: true,
      meta: { customCss: { width: '40%' } },
    }),
    columnHelper.accessor('variable_value', {
      id: 'variable_value',
      cell: (info) => (
        <input value={info.getValue()} className="form-control readonlyInput" title={info.getValue()} readOnly />
      ),
      header: () => 'Value',
      enableSorting: false,
      meta: { customCss: { width: '40%' } },
    }),
    columnHelper.display({
      id: 'edit',
      cell: (info) => <LinkButton onClick={() => displayEditVariable(info.row.original.id)} text="Edit" />,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.display({
      id: 'remove',
      cell: (info) => <LinkButton onClick={() => displayRemoveVariable(info.row.original.id)} text="Remove" />,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('id', {
      id: 'id',
      cell: () => null,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={sortedVariables}
      enableSorting={true}
      initialSorting={[{ id: 'variable_name', desc: false }]}
    />
  );
};

export default ManageVariablesTable;
