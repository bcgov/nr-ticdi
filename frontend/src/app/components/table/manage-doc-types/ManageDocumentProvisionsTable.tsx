import React, { FC, useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import {
  ManageDocTypeProvision,
  associateProvisionToDocType,
  disassociateProvisionFromDocType,
} from '../../../common/manage-doc-types';
import { ProvisionGroup } from '../../../types/types';
import { DocumentProvisionSearchState } from '../../common/manage-doc-types/DocumentProvisionSearch';

interface ManageDocumentProvisionsTableProps {
  documentTypeId: number;
  provisions: ManageDocTypeProvision[] | undefined;
  provisionGroups: ProvisionGroup[] | undefined;
  searchState: DocumentProvisionSearchState;
  refreshTables: () => void;
  onUpdate: (manageDocTypeProvisions: ManageDocTypeProvision[]) => void;
}

const ManageDocumentProvisionsTable: React.FC<ManageDocumentProvisionsTableProps> = ({
  documentTypeId,
  provisions,
  provisionGroups,
  searchState,
  refreshTables,
  onUpdate,
}) => {
  const [allProvisions, setAllProvisions] = useState<ManageDocTypeProvision[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<ManageDocTypeProvision[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (provisions) {
      setAllProvisions(provisions);
    }
  }, [provisions]);

  useEffect(() => {
    const searchFilteredProvisions = allProvisions.filter((provision) => {
      // Basic search checks (applies in both basic and advanced search modes)
      const matchesId = searchState.id ? provision.id === Number(searchState.id) : true;
      const matchesProvisionName = searchState.provisionName
        ? provision.provision_name.toLowerCase().includes(searchState.provisionName.toLowerCase())
        : true;

      // Advanced search checks (only apply if isAdvancedSearch is true)
      const matchesType = searchState.isAdvancedSearch
        ? searchState.type
          ? provision.type.toLowerCase().includes(searchState.type.toLowerCase())
          : true
        : true;
      const matchesGroup = searchState.isAdvancedSearch
        ? searchState.group
          ? provision.provision_group === Number(searchState.group)
          : true
        : true;
      const matchesFreeText = searchState.isAdvancedSearch
        ? searchState.freeText
          ? provision.free_text.toLowerCase().includes(searchState.freeText.toLowerCase())
          : true
        : true;
      const matchesCategory = searchState.isAdvancedSearch
        ? searchState.category
          ? provision.category.toLowerCase().includes(searchState.category.toLowerCase())
          : true
        : true;
      const matchesAssociated = searchState.isAdvancedSearch
        ? typeof searchState.associated === 'boolean'
          ? provision.associated === searchState.associated
          : true
        : true;

      return (
        matchesId &&
        matchesProvisionName &&
        matchesType &&
        matchesGroup &&
        matchesFreeText &&
        matchesCategory &&
        matchesAssociated
      );
    });
    setFilteredProvisions(searchFilteredProvisions);
  }, [allProvisions, searchState]);

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

  const handleCellUpdate = (provisionId: number, columnId: keyof ManageDocTypeProvision, newValue: any) => {
    const newFilteredProvisions = filteredProvisions.map((provision, index) => {
      if (provision.id === provisionId) {
        const updatedValue =
          columnId === 'provision_group' || columnId === 'sequence_value' ? parseInt(newValue, 10) : newValue;

        return { ...provision, [columnId]: updatedValue };
      }
      return provision;
    });
    const newProvisions = allProvisions.map((provision, index) => {
      if (provision.id === provisionId) {
        const updatedValue =
          columnId === 'provision_group' || columnId === 'sequence_value' ? parseInt(newValue, 10) : newValue;
        console.log('columnId: ' + columnId);
        console.log('updatedValue: ' + updatedValue);
        return { ...provision, [columnId]: updatedValue };
      }
      return provision;
    });

    setFilteredProvisions(newFilteredProvisions);
    setAllProvisions(newProvisions);
    onUpdate(newProvisions);
  };

  const handleProvisionGroupUpdate = (provisionId: number, provisionGroup: ProvisionGroup | undefined) => {
    setAllProvisions((currentProvisions) =>
      currentProvisions.map((provision) => {
        if (provision.id === provisionId && provisionGroup) {
          return {
            ...provision,
            provision_group: provisionGroup?.provision_group,
            provision_group_object: provisionGroup,
            max: provisionGroup?.max,
          };
        }
        return provision;
      })
    );
    setFilteredProvisions((currentProvisions) =>
      currentProvisions.map((provision) => {
        if (provision.id === provisionId && provisionGroup) {
          return {
            ...provision,
            provision_group: provisionGroup?.provision_group,
            provision_group_object: provisionGroup,
            max: provisionGroup?.max,
          };
        }
        return provision;
      })
    );
    onUpdate(allProvisions);
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
      cell: ({ row }) => (
        <TableCell
          getValue={() => row.original.type}
          row={row}
          columnId="type"
          onCellUpdate={handleCellUpdate}
          inputType="select"
          selectOptions={[
            { value: '', label: '' },
            { value: 'O', label: 'O' },
            { value: 'M', label: 'M' },
            { value: 'B', label: 'B' },
            { value: 'V', label: 'V' },
          ]}
        />
      ),
      header: () => 'Type',
      enableSorting: true,
      meta: { customCss: { width: '7%' } },
    }),
    columnHelper.accessor('provision_group', {
      id: 'provision_group',
      cell: ({ row }) => (
        <ProvisionGroupCell
          row={row}
          provisionGroups={provisionGroups}
          onUpdate={(provisionId, provisionGroup) => {
            handleProvisionGroupUpdate(provisionId, provisionGroup);
          }}
        />
      ),
      header: () => 'Group',
      enableSorting: true,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('sequence_value', {
      id: 'sequence_value',
      cell: ({ row }) => (
        <TableCell
          getValue={() => row.original.sequence_value}
          row={row}
          columnId="sequence_value"
          onCellUpdate={handleCellUpdate}
          inputType="text"
        />
      ),
      header: () => 'Seq',
      enableSorting: false,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('max', {
      id: 'provision_group_max',
      cell: (info) => (
        <input
          value={info.row.original.max ? info.row.original.max : ''}
          className="readonlyInput"
          readOnly
          onChange={() => {}}
        />
      ),
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
      data={filteredProvisions}
      // paginationSetup={{ enabled: true, pageSize: 10 }}
      enableSorting={true}
      initialSorting={[
        { id: 'associated', desc: true },
        // { id: 'provision_group', desc: false },
        // { id: 'provision_name', desc: false },
      ]}
    />
  );
};

// custom cell for associated column
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

// custom cell for Provision Group column
interface ProvisionGroupCellProps {
  row: Row<ManageDocTypeProvision>;
  provisionGroups: ProvisionGroup[] | undefined;
  onUpdate: (provisionId: number, provisionGroup: ProvisionGroup | undefined) => void;
}
const ProvisionGroupCell: React.FC<ProvisionGroupCellProps> = ({ row, provisionGroups, onUpdate }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const inputStyle = {
    width: '100%',
    backgroundColor: isValid === true ? '#e8ffe8' : isValid === false ? '#ffe8e8' : '#fff',
  };

  useEffect(() => {
    const initialProvisionGroup = row.original.provision_group?.toString();
    setInputValue(initialProvisionGroup || '');
  }, [row.original.provision_group]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const matchedProvisionGroup = provisionGroups?.find((group) => group.provision_group.toString() === newValue);
    setIsValid(matchedProvisionGroup !== undefined);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const matchedProvisionGroup = provisionGroups?.find((group) => group.provision_group.toString() === newValue);
    onUpdate(row.original.id, matchedProvisionGroup);
  };

  return <input type="number" value={inputValue} onBlur={handleBlur} onChange={handleChange} style={inputStyle} />;
};

// custom cell for type and sequence columns
interface TableCellProps<T> {
  getValue: () => any;
  row: Row<T>;
  columnId: keyof ManageDocTypeProvision;
  onCellUpdate: (provisionId: number, columnId: keyof ManageDocTypeProvision, newValue: any) => void;
  inputType: 'text' | 'select';
  selectOptions?: { value: string; label: string }[];
}
const TableCell: FC<TableCellProps<ManageDocTypeProvision>> = ({
  getValue,
  row,
  columnId,
  onCellUpdate,
  inputType,
  selectOptions = [],
}) => {
  let initialValue = getValue() ? getValue() : '';
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    onCellUpdate(row.original.id, columnId, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onCellUpdate(row.original.id, columnId, newValue);
  };

  return inputType === 'select' ? (
    <select value={value} onChange={handleSelectChange} style={{ width: '100%' }}>
      {selectOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : (
    <input type="text" value={value} onChange={handleChange} onBlur={handleBlur} style={{ width: '100%' }} />
  );
};

export default ManageDocumentProvisionsTable;
