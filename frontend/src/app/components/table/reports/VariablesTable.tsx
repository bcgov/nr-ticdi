import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { VariableData } from '../../../content/display/Variables';

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
  const [edits, setEdits] = useState<{ [variableId: number]: string }>({});

  const handleEdit = (variableId: number, newValue: string) => {
    setEdits((currentEdits) => ({ ...currentEdits, [variableId]: newValue }));
  };

  useEffect(() => {
    return () => {
      const updatedVariables = variables.map((variable) => ({
        ...variable,
        variable_value: edits[variable.id] ?? variable.variable_value,
      }));
      const variableJson = updatedVariables.map((variable) => ({
        provision_id: variable.provision.id,
        variable_id: variable.id,
        variable_name: variable.variable_name,
        variable_value: variable.variable_value,
      }));
      updateHandler(variableJson);
    };
  }, [edits]);

  const saveChanges = (variableId: number, newValue: string) => {
    const updatedVariables = variables.map((variable) =>
      variable.id === variableId ? { ...variable, variable_value: newValue } : variable
    );
    const variableJson = updatedVariables.map((variable) => ({
      provision_id: variable.provision.id,
      variable_id: variable.id,
      variable_name: variable.variable_name,
      variable_value: variable.variable_value,
    }));
    updateHandler(variableJson);
  };

  useEffect(() => {
    if (variables.length > 0 && !initialized) {
      setInitialized(true);
      updateHandler(
        variables.map((variable) => ({
          provision_id: variable.provision.id,
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
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Variable',
      meta: { customCss: { width: '28%' } },
    }),
    columnHelper.accessor('variable_value', {
      id: 'variable_value',
      cell: (info) => (
        <VariableValueCell value={info.getValue()} updateValue={handleEdit} variableId={info.row.original.id} />
      ),
      header: () => 'Enter Text',
      meta: { customCss: { width: '36%' } },
    }),
    columnHelper.accessor('help_text', {
      id: 'help_text',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" title={info.getValue()} readOnly />,
      header: () => 'Help',
      meta: { customCss: { width: '36%' } },
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

interface VariableValueCellProps {
  value: string;
  updateValue: (v: number, i: string) => void;
  variableId: number;
}

const VariableValueCell: React.FC<VariableValueCellProps> = ({ value, updateValue, variableId }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    updateValue(variableId, newValue);
  };

  return <input value={inputValue} onChange={handleChange} style={{ width: '100%' }} />;
};

export default VariablesTable;
