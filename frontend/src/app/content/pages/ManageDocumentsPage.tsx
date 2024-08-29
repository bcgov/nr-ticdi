import { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { DocType, ProvisionGroup } from '../../types/types';
import { getDocumentTypes, getGroupMaxByDocTypeId } from '../../common/report';
import ManageDocTypesTable from '../../components/table/manage-doc-types/ManageDocTypesTable';
import AddDocTypeModal from '../../components/modal/manage-doc-types/AddDocTypeModal';
import RemoveDocTypeModal from '../../components/modal/manage-doc-types/RemoveDocTypeModal';
import {
  ManageDocTypeProvision,
  ProvisionInfo,
  addDocType,
  getManageDocumentTypeProvisions,
  removeDocType,
  updateManageDocTypeProvisions,
} from '../../common/manage-doc-types';
import EditProvisionGroupsModal from '../../components/modal/manage-doc-types/EditProvisionGroupsModal';
import EditDocTypeTable from '../../components/table/manage-doc-types/EditDocTypeTable';
import DocumentProvisionSearch, {
  DocumentProvisionSearchState,
} from '../../components/common/manage-doc-types/DocumentProvisionSearch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setDocType } from '../../store/reducers/docTypeSlice';
import GlobalProvisionModal from '../../components/modal/manage-doc-types/GlobalProvisionModal';
import ManageDocumentProvisionsTable2 from '../../components/table/manage-doc-types/ManageDocumentProvisionsTable2';

const ManageDocumentsPage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showMain, setShowMain] = useState<boolean>(true);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [allDocTypes, setAllDocTypes] = useState<DocType[]>([]);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);
  const [provisions, setProvisions] = useState<ManageDocTypeProvision[]>([]);
  const [selectedGlobalProvision, setSelectedGlobalProvision] = useState<ProvisionInfo | null>(null);
  const [showGlobalProvisionModal, setShowGlobalProvisionModal] = useState<boolean>(false);

  const [showAddDocTypeModal, setShowAddDocTypeModal] = useState<boolean>(false);
  const [showRemoveDocTypeModal, setShowRemoveDocTypeModal] = useState<boolean>(false);
  const [showEditProvisionGroupsModal, setShowEditProvisionGroupsModal] = useState<boolean>(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshDocTypesTrigger, setRefreshDocTypesTrigger] = useState(0);

  const [updatedProvisions, setUpdatedProvisions] = useState<ManageDocTypeProvision[]>([]);
  const [searchState, setSearchState] = useState<DocumentProvisionSearchState>({
    provisionName: '',
    id: '',
    type: '',
    group: '',
    freeText: '',
    category: '',
    associated: true,
    isAdvancedSearch: false,
  });

  const dispatch = useDispatch();
  const { selectedDocType, updatedProvisionsArray } = useSelector((state: RootState) => state.docType);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const docTypeData = await getDocumentTypes();
        setAllDocTypes(docTypeData);
      } catch (error) {
        console.log('Failed to fetch document types');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [refreshDocTypesTrigger]);

  useEffect(() => {
    const getData = async () => {
      if (selectedDocType.id !== -1) {
        const groupData = await getGroupMaxByDocTypeId(selectedDocType.id);
        setProvisionGroups(groupData);
        const provisionData = await getManageDocumentTypeProvisions(selectedDocType.id);
        setProvisions(provisionData);
      } else {
        setProvisionGroups([]);
        setProvisions([]);
      }
    };
    getData();
  }, [refreshTrigger, selectedDocType]);

  useEffect(() => {
    setUpdatedProvisions(provisions);
  }, [provisions]);

  const refreshDocTypes = () => {
    setRefreshDocTypesTrigger((prev) => prev + 1);
  };

  const refreshTables = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const showEditPage = (id: number) => {
    const newSelectedDocType = allDocTypes.find((docType) => docType.id === id);
    if (newSelectedDocType) {
      dispatch(setDocType(newSelectedDocType));
      setShowMain(false);
      setShowEdit(true);
    }
  };

  const showMainPage = () => {
    setShowEdit(false);
    setShowMain(true);
  };

  const openAddDocTypeModal = () => {
    setShowAddDocTypeModal(true);
  };

  const addDocTypeHandler = async (name: string, prefix: string, created_by: string, created_date: string) => {
    try {
      setLoading(true);
      await addDocType(name, prefix, created_by, created_date);
      refreshDocTypes();
    } catch (err) {
      console.log('Error adding doc type');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openRemoveDocTypeModal = (id: number) => {
    const newSelectedDocType = allDocTypes.find((docType) => docType.id === id);
    if (newSelectedDocType) {
      dispatch(setDocType(newSelectedDocType));
      setShowRemoveDocTypeModal(true);
    }
  };

  const removeDocTypeHandler = async (id: number) => {
    try {
      setLoading(true);
      await removeDocType(id);
      refreshDocTypes();
    } catch (err) {
      console.log('Error removing doc type');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // called when a provision is altered in the ManageDocumentProvisionstable
  const updateProvisionsState = (newProvisionsState: ManageDocTypeProvision[]) => {
    setUpdatedProvisions(newProvisionsState);
  };

  const saveButtonHandler = async () => {
    try {
      setLoading(true);
      await updateManageDocTypeProvisions(selectedDocType.id, updatedProvisionsArray);
    } catch (err) {
      console.log('Error updating provisions');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const setSearchStateHandler = (searchState: DocumentProvisionSearchState) => {
    setSearchState(searchState);
  };

  const openGlobalProvisionModal = (provision: ProvisionInfo | null) => {
    if (provision) {
      setSelectedGlobalProvision(provision);
      setShowGlobalProvisionModal(true);
    }
  };

  return (
    <>
      {showMain && (
        <>
          <h1>Manage Document Types</h1>
          <hr />
          <ManageDocTypesTable
            documentTypes={allDocTypes}
            handleEdit={showEditPage}
            handleRemove={openRemoveDocTypeModal}
          />
          <Button variant="success" onClick={() => openAddDocTypeModal()}>
            Add New
          </Button>
          <AddDocTypeModal
            allDocTypes={allDocTypes}
            show={showAddDocTypeModal}
            onHide={() => setShowAddDocTypeModal(false)}
            onAdd={addDocTypeHandler}
          />

          {selectedDocType && (
            <RemoveDocTypeModal
              documentType={selectedDocType}
              show={showRemoveDocTypeModal}
              onHide={() => setShowRemoveDocTypeModal(false)}
              onRemove={removeDocTypeHandler}
            />
          )}
        </>
      )}
      {showEdit && (
        <>
          <h1>Edit Document Type - {selectedDocType.name}</h1>
          <hr />
          {/** Doc Type info / edit single row table */}
          {/** Document Type Name - Date Created - Created By - Last Updated Date - Last Updated By */}
          <EditDocTypeTable refreshDocTypes={refreshDocTypes} />
          <hr />
          <h1>Associate Provisions to {selectedDocType.name}</h1>
          <hr />
          {/** Search implementation */}
          {/** Advanced Search: different inputs - id, type, group, free text, category */}
          <Row className="mt-3 mb-3">
            <DocumentProvisionSearch onSearch={setSearchStateHandler} />
            {/** Name/group search box - Advanced Search - Associated - Edit Provision Groups*/}
            <Col sm={4}>
              <Button variant="primary" onClick={() => setShowEditProvisionGroupsModal(true)}>
                Edit Provision Groups
              </Button>
            </Col>
          </Row>

          {/** Global Provisions table */}
          <ManageDocumentProvisionsTable2
            provisions={provisions}
            provisionGroups={provisionGroups}
            searchState={searchState}
            onUpdate={updateProvisionsState}
            openModal={openGlobalProvisionModal}
          />
          {/** ID - Type - Group - Seq - Max - Provision Name - Free Text - Category - Associated */}
          <EditProvisionGroupsModal
            provisionGroups={provisionGroups}
            documentTypeId={selectedDocType.id}
            show={showEditProvisionGroupsModal}
            refreshTables={refreshTables}
            onHide={() => setShowEditProvisionGroupsModal(false)}
          />
          {/** Save and Go Back Buttons */}
          <Col sm={12} className="d-flex justify-content-end align-items-center">
            <Button variant="secondary" onClick={showMainPage} style={{ margin: '10px' }}>
              Go Back
            </Button>
            <Button
              variant="success"
              onClick={saveButtonHandler}
              style={{ margin: '10px', marginRight: '50px' }}
              disabled={loading}
            >
              Save
            </Button>
          </Col>
          {showGlobalProvisionModal && (
            <GlobalProvisionModal
              show={showGlobalProvisionModal}
              onHide={() => setShowGlobalProvisionModal(false)}
              provision={selectedGlobalProvision}
            />
          )}
        </>
      )}
    </>
  );
};

export default ManageDocumentsPage;
