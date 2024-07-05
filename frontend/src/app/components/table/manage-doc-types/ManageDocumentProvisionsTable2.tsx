import React, { FC, useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import { ManageDocTypeProvision } from '../../../common/manage-doc-types';
import { ProvisionGroup } from '../../../types/types';
import { DocumentProvisionSearchState } from '../../common/manage-doc-types/DocumentProvisionSearch';
import {
  DataGrid,
  GridCellEditStopParams,
  GridCellParams,
  GridColDef,
  GridRowId,
  GridValueOptionsParams,
  GridValueSetter,
  MuiEvent,
} from '@mui/x-data-grid';

interface ManageDocumentProvisionsTable2Props {
  provisions: ManageDocTypeProvision[] | undefined;
  provisionGroups: ProvisionGroup[] | undefined;
  searchState: DocumentProvisionSearchState;
  onUpdate: (manageDocTypeProvisions: ManageDocTypeProvision[]) => void;
  openModal: (provision_id: number) => void;
}

const ManageDocumentProvisionsTable2: React.FC<ManageDocumentProvisionsTable2Props> = ({
  provisions,
  provisionGroups,
  searchState,
  onUpdate,
  openModal,
}) => {
  const [allProvisions, setAllProvisions] = useState<ManageDocTypeProvision[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<ManageDocTypeProvision[]>([]);
  const [updatedProvisions, setUpdatedProvisions] = useState<ManageDocTypeProvision[]>([]);
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
          ? provision.type && provision.type.includes(searchState.type)
          : true
        : true;
      const matchesGroup = searchState.isAdvancedSearch
        ? searchState.group
          ? provision.provision_group === Number(searchState.group)
          : true
        : true;
      const matchesFreeText = searchState.isAdvancedSearch
        ? searchState.freeText
          ? provision.free_text && provision.free_text.toLowerCase().includes(searchState.freeText.toLowerCase())
          : true
        : true;
      const matchesCategory = searchState.isAdvancedSearch
        ? searchState.category
          ? provision.category && provision.category.toLowerCase().includes(searchState.category.toLowerCase())
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

  useEffect(() => {
    onUpdate(allProvisions);
  }, [allProvisions, onUpdate]);

  const associateCheckboxHandler = async (provisionId: number, newValue: boolean) => {
    try {
      setLoading(true);
      let updatedAllProvisions: ManageDocTypeProvision[] = [];
      let updatedFilteredProvisions: ManageDocTypeProvision[] = [];

      // Update all provisions and store the updated list in a variable
      setAllProvisions((prevProvisions) => {
        updatedAllProvisions = prevProvisions.map((provision) => {
          if (provision.id === provisionId) {
            return { ...provision, associated: newValue };
          }
          return provision;
        });
        return updatedAllProvisions;
      });

      // Update filtered provisions and store the updated list in a variable
      setFilteredProvisions((prevProvisions) => {
        updatedFilteredProvisions = prevProvisions.map((provision) => {
          if (provision.id === provisionId) {
            return { ...provision, associated: newValue };
          }
          return provision;
        });
        return updatedFilteredProvisions;
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
        return { ...provision, [columnId]: updatedValue };
      }
      return provision;
    });

    setFilteredProvisions(newFilteredProvisions);
    setAllProvisions(newProvisions);
    onUpdate(newProvisions);
  };

  const handleProvisionGroupUpdate = (provisionId: number, provisionGroup: ProvisionGroup | undefined) => {
    // console.log(provisionId);
    // console.log(provisionGroup);
    console.log('adjusting');
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

  const openGPModal = (provision_id: number) => {
    openModal(provision_id);
  };

  //   const handleCellEditStop = (params: GridCellEditStopParams) => {
  //     console.log('handleEditStop');
  //     console.log(params);
  //     if (params.field === 'provision_group' && provisionGroups) {
  //       const provisionGroup = provisionGroups.find((group) => group.provision_group === params.value) || undefined;
  //       handleProvisionGroupUpdate(params.id as number, provisionGroup);
  //     }
  //     // params = data row, add this edited version to a state, on save, update the ManageDocTypeProvisions in this state
  //   };

  const handleRowUpdate = (updatedRow: any, originalRow: any) => {
    console.log(updatedRow);
    console.log(originalRow);
  };

  const trackUpdate = (id: GridRowId, field: string, value: any) => {
    console.log(id, field, value);
  };

  const columns: GridColDef[] = [
    {
      field: 'provision_id',
      headerName: 'ID',
      width: 80,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['', 'O', 'M', 'B', 'V'],
      width: 80,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'provision_group',
      headerName: 'Group',
      editable: true,
      type: 'number',
      width: 80,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'sequence_value',
      headerName: 'Seq',
      editable: true,
      type: 'number',
      width: 80,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'max',
      headerName: 'Max',
      type: 'number',
      width: 80,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'provision_name',
      headerName: 'Provision',
      width: 400,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'free_text',
      headerName: 'Free Text',
      width: 80,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <input
          value={params.value}
          className="form-control readonlyInput hoverUnderline"
          readOnly
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
      ),
    },
    {
      field: 'associated',
      headerName: 'Associated',
      editable: true,
      type: 'boolean',
      width: 100,
    },
  ];

  return (
    <div style={{ height: '632px', width: '100%' }}>
      <DataGrid
        rows={filteredProvisions}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        processRowUpdate={(updatedRow, originalRow) => {
          console.log('originalRow: ', originalRow);
          console.log('updatedRow: ', updatedRow);
          return updatedRow;
        }}
        onProcessRowUpdateError={(error) => {
          console.error('Error updating row:', error);
        }}
        pageSizeOptions={[10, 20, 50]}
        // onCellEditStop={(params) => {
        //   console.log(params);
        // }}
        onCellClick={(params) => {
          if (params.field === 'provision_id') {
            openGPModal(params.value as number);
          }
        }}
        getRowId={(row) => {
          return row?.id as number;
        }}
      />
    </div>
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

export default ManageDocumentProvisionsTable2;
