import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { VariableData } from '../../../content/display/Variables';
import VariableValueCell from './VariableValueCell';

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

interface VariablesTableProps {
  variables: VariableData[];
  updateHandler: (variableSaveData: VariableJson[]) => void;
}

const VariablesTable: React.FC<VariablesTableProps> = React.memo(({ variables, updateHandler }) => {
  const [initialized, setInitialized] = useState(false);
  const saveChanges = (variableId: number, newValue: string) => {
    const updatedVariables = variables.map((variable) =>
      variable.id === variableId ? { ...variable, variable_value: newValue } : variable
    );
    const variableJson = updatedVariables.map((variable) => ({
      provision_id: variable.provisionId,
      variable_id: variable.id,
      variable_name: variable.variable_name,
      variable_value: variable.variable_value,
    }));
    updateHandler(variableJson);
  };

  // parent state is [] so initialize the variables from here
  useEffect(() => {
    if (variables.length > 0 && !initialized) {
      setInitialized(true);
      updateHandler(
        variables.map((variable) => ({
          provision_id: variable.provisionId,
          variable_id: variable.id,
          variable_name: variable.variable_name,
          variable_value: variable.variable_value,
        }))
      );
    }
  }, [initialized, variables, updateHandler]);

  const columnHelper = createColumnHelper<VariableData>();
  const columns: ColumnDef<VariableData, any>[] = [
    columnHelper.accessor('variable_name', {
      id: 'variable_name',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '300px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Variable',
      meta: { customCss: { minWidth: '300px', width: '300px' } },
    }),
    columnHelper.accessor('variable_value', {
      id: 'variable_value',
      cell: (info) => (
        <VariableValueCell value={info.getValue()} updateValue={saveChanges} variableId={info.row.original.id} />
      ),
      header: () => 'Enter Text',
      meta: { customCss: { minWidth: '400px', width: '400px' } },
    }),
    columnHelper.accessor('help_text', {
      id: 'help_text',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '400px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Help',
      meta: { customCss: { minWidth: '400px', width: '400px' } },
    }),
    columnHelper.accessor('id', {
      id: 'id',
      cell: () => null,
      header: () => null,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return <DataTable columns={columns} data={variables} />;
});

export default VariablesTable;
