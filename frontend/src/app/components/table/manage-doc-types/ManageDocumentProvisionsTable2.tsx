import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import { getProvisionInfo, ManageDocTypeProvision, ProvisionInfo } from '../../../common/manage-doc-types';
import { Provision, ProvisionGroup } from '../../../types/types';
import { DocumentProvisionSearchState } from '../../common/manage-doc-types/DocumentProvisionSearch';
import { DataGrid, GridCellModes, GridCellModesModel, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { setUpdatedProvisionsArray } from '../../../store/reducers/docTypeSlice';

interface ManageDocumentProvisionsTable2Props {
  provisions: ManageDocTypeProvision[] | undefined;
  provisionGroups: ProvisionGroup[] | undefined;
  searchState: DocumentProvisionSearchState;
  onUpdate: (manageDocTypeProvisions: ManageDocTypeProvision[]) => void;
  openModal: (provision: ProvisionInfo | null) => void;
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
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
  const dispatch = useDispatch();

  // initialize provisions
  useEffect(() => {
    if (provisions) {
      setAllProvisions(provisions);
    }
  }, [provisions]);

  useEffect(() => {
    onUpdate(allProvisions);
  }, [allProvisions, onUpdate]);

  useEffect(() => {
    dispatch(setUpdatedProvisionsArray(updatedProvisions));
  }, [updatedProvisions, dispatch]);

  const openGPModal = async (provision_id: number) => {
    const provision = await getProvisionInfo(provision_id);
    openModal(provision ? provision : null);
  };

  const handleCellClick = React.useCallback((params: GridCellParams) => {
    if (params.field === 'provision_id') {
      openGPModal(params.value as number);
    }
    if (params.isEditable && params.field !== 'type' && params.field !== 'associated') {
      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    }
  }, []);

  const handleCellModesModelChange = React.useCallback((newModel: any) => {
    setCellModesModel(newModel);
  }, []);

  useEffect(() => {
    const searchFilteredProvisions = allProvisions.filter((provision) => {
      // Basic search checks (applies in both basic and advanced search modes)
      const matchesId = searchState.id ? provision.provision_id.toString().includes(searchState.id) : true;
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

  const handleRowUpdate = (
    updatedRow: ManageDocTypeProvision,
    originalRow: ManageDocTypeProvision
  ): ManageDocTypeProvision => {
    if (updatedRow.provision_group !== originalRow.provision_group) {
      const provisionGroup = provisionGroups
        ? provisionGroups.find((group) => group.provision_group === updatedRow.provision_group)
        : null;
      if (provisionGroup) {
        updatedRow = {
          ...updatedRow,
          provision_group_object: provisionGroup ? provisionGroup : null,
          max: provisionGroup?.max || 999,
        };
      } else {
        updatedRow = originalRow;
      }
    }

    setUpdatedProvisions((prevUpdatedProvisions) => {
      const existingProvisionIndex = prevUpdatedProvisions.findIndex((provision) => provision.id === updatedRow.id);

      if (existingProvisionIndex >= 0) {
        const updatedProvisionsCopy = [...prevUpdatedProvisions];
        updatedProvisionsCopy[existingProvisionIndex] = updatedRow;
        return updatedProvisionsCopy;
      } else {
        return [...prevUpdatedProvisions, updatedRow];
      }
    });
    setAllProvisions((prevAllProvisions) => {
      const existingProvisionIndex = prevAllProvisions.findIndex((provision) => provision.id === updatedRow.id);

      if (existingProvisionIndex >= 0) {
        const updatedProvisionsCopy = [...prevAllProvisions];
        updatedProvisionsCopy[existingProvisionIndex] = updatedRow;
        return updatedProvisionsCopy;
      } else {
        return prevAllProvisions;
      }
    });

    return updatedRow;
  };

  const columns: GridColDef[] = [
    {
      field: 'provision_id',
      headerName: 'ID',
      width: 80,
      renderCell: (params) => (
        <input
          value={params.value ? params.value : ''}
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
      width: 65,
      renderCell: (params) => (
        <input
          value={params.value !== null ? params.value : ''}
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
          value={params.value ? params.value : ''}
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
          value={params.value ? params.value : ''}
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
          value={params.value ? params.value : ''}
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
          value={params.value ? params.value : ''}
          title={params.value ? params.value : ''}
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
          value={params.value ? params.value : ''}
          title={params.value ? params.value : ''}
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
          value={params.value ? params.value : ''}
          title={params.value ? params.value : ''}
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
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) => {
            const newValue = event.target.checked;
            const updatedRow = { ...params.row, associated: newValue };
            handleRowUpdate(updatedRow, params.row);
          }}
        />
      ),
    },
  ];

  return (
    <DataGrid
      rows={filteredProvisions}
      columns={columns}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      processRowUpdate={(updatedRow, originalRow) => {
        return handleRowUpdate(updatedRow, originalRow);
      }}
      onProcessRowUpdateError={(error) => {
        console.error('Error updating row:', error);
      }}
      pageSizeOptions={[10, 20, 50]}
      cellModesModel={cellModesModel}
      onCellModesModelChange={handleCellModesModelChange}
      onCellClick={handleCellClick}
      getRowId={(row) => {
        return row?.id as number;
      }}
      autoHeight={true}
      sx={{
        '& .MuiDataGrid-footerContainer p': {
          marginTop: '12px',
        },
      }}
    />
  );
};

export default ManageDocumentProvisionsTable2;
