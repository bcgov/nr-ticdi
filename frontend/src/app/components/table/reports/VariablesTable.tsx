import React, { FC, useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Variable } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export type SaveVariableData = {
  provision_id: number;
  variable_id: number;
  variable_value: string;
};

export type VariableJson = {
  provision_id: number;
  variable_id: number;
  variable_name: string;
  variable_value: string;
};

const VariablesTable: React.FC<{ onVariableEdit: (variableId: number, newValue: string) => void }> = ({
  onVariableEdit,
}) => {
  const [filteredVariables, setFilteredVariables] = useState<Variable[]>([]); // provisions in the currently selected group

  const selectedVariableIds = useSelector((state: RootState) => state.variable.selectedVariableIds);
  const variables: Variable[] = useSelector((state: RootState) => state.variable.variables);

  useEffect(() => {
    const filtered: Variable[] | null = variables
      ? variables.filter((variable) => selectedVariableIds.includes(variable.id))
      : null;
    if (filtered) setFilteredVariables(filtered);
  }, [variables, selectedVariableIds]);

  useEffect(() => {
    const filtered: Variable[] | null = variables
      ? variables.filter((variable) => selectedVariableIds.includes(variable.id))
      : null;
    if (filtered) setFilteredVariables(filtered);
  }, [variables, selectedVariableIds]);

  const handleEdit = (variableId: number, newValue: string) => {
    onVariableEdit(variableId, newValue);
  };
  console.log('re-render');

  const columnHelper = createColumnHelper<Variable>();
  const columns: ColumnDef<Variable, any>[] = [
    columnHelper.accessor('variable_name', {
      id: 'variable_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Variable',
      enableSorting: true,
      meta: { customCss: { width: '28%' } },
    }),
    columnHelper.accessor('variable_value', {
      id: 'variable_value',
      cell: ({ row }) => (
        <TableCell
          getValue={() => row.original.variable_value}
          variableId={row.original.id}
          onCellUpdate={handleEdit}
        />
      ),
      header: () => 'Enter Text',
      enableSorting: false,
      meta: { customCss: { width: '36%' } },
    }),
    columnHelper.accessor('help_text', {
      id: 'help_text',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Help',
      enableSorting: false,
      meta: { customCss: { width: '36%' } },
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
      data={filteredVariables}
      enableSorting={true}
      initialSorting={[{ id: 'variable_name', desc: false }]}
    />
  );
};

interface TableCellProps {
  getValue: () => any;
  variableId: number;
  onCellUpdate: (variableId: number, newValue: any) => void;
}
const TableCell: FC<TableCellProps> = ({ getValue, variableId, onCellUpdate }) => {
  let initialValue = getValue() ? getValue() : '';
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    onCellUpdate(variableId, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  return <input type="text" value={value} onChange={handleChange} onBlur={handleBlur} style={{ width: '100%' }} />;
};

export default React.memo(VariablesTable);
