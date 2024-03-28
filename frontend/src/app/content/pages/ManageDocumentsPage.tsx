import { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { DocType, ProvisionGroup } from '../../types/types';
import { getDocumentTypes, getGroupMaxByDocTypeId } from '../../common/report';
import ManageDocTypesTable from '../../components/table/manage-doc-types/ManageDocTypesTable';
import AddDocTypeModal from '../../components/modal/manage-doc-types/AddDocTypeModal';
import RemoveDocTypeModal from '../../components/modal/manage-doc-types/RemoveDocTypeModal';
import {
  ManageDocTypeProvision,
  addDocType,
  getManageDocumentTypeProvisions,
  removeDocType,
  updateDocType,
  updateManageDocTypeProvisions,
} from '../../common/manage-doc-types';
import EditProvisionGroupsModal from '../../components/modal/manage-doc-types/EditProvisionGroupsModal';
import ManageDocumentProvisionsTable from '../../components/table/manage-doc-types/ManageDocumentProvisionsTable';
import EditDocTypeTable from '../../components/table/manage-doc-types/EditDocTypeTable';
import DocumentProvisionSearch, {
  DocumentProvisionSearchState,
} from '../../components/common/manage-doc-types/DocumentProvisionSearch';

const ManageDocumentsPage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showMain, setShowMain] = useState<boolean>(true);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [currentDocType, setCurrentDocType] = useState<DocType>({
    id: -1,
    name: '',
    created_by: '',
    created_date: '',
    create_userid: '',
    create_timestamp: '',
    update_timestamp: '',
    update_userid: '',
  });
  const [updatedDocType, setUpdatedDocType] = useState<DocType>({
    id: -1,
    name: '',
    created_by: '',
    created_date: '',
    create_userid: '',
    create_timestamp: '',
    update_timestamp: '',
    update_userid: '',
  });
  const [allDocTypes, setAllDocTypes] = useState<DocType[]>([]);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);
  const [provisions, setProvisions] = useState<ManageDocTypeProvision[]>([]);

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

  useEffect(() => {
    const getData = async () => {
      const docTypeData = await getDocumentTypes();
      setAllDocTypes(docTypeData);
    };
    getData();
  }, [refreshDocTypesTrigger]);

  useEffect(() => {
    const getData = async () => {
      if (currentDocType.id !== -1) {
        const groupData = await getGroupMaxByDocTypeId(currentDocType.id);
        setProvisionGroups(groupData);
        const provisionData = await getManageDocumentTypeProvisions(currentDocType.id);
        setProvisions(provisionData);
      } else {
        setProvisionGroups([]);
        setProvisions([]);
      }
    };
    getData();
  }, [refreshTrigger, currentDocType]);

  useEffect(() => {
    setUpdatedDocType(currentDocType);
  }, [currentDocType]);

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
    const selectedDocType = allDocTypes.find((docType) => docType.id === id);
    if (selectedDocType) {
      setCurrentDocType(selectedDocType);
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

  const addDocTypeHandler = async (name: string, created_by: string, created_date: string) => {
    try {
      await addDocType(name, created_by, created_date);
      refreshDocTypes();
    } catch (err) {
      console.log('Error adding doc type');
      console.log(err);
    }
  };

  const openRemoveDocTypeModal = (id: number) => {
    const selectedDocType = allDocTypes.find((docType) => docType.id === id);
    if (selectedDocType) {
      setCurrentDocType(selectedDocType);
      setShowRemoveDocTypeModal(true);
    }
  };

  const removeDocTypeHandler = async (id: number) => {
    try {
      await removeDocType(id);
      refreshDocTypes();
    } catch (err) {
      console.log('Error removing doc type');
      console.log(err);
    }
  };

  const handleUpdateDocTypeState = (updatedDocType: DocType) => {
    setUpdatedDocType(updatedDocType);
  };

  const updateProvisionsState = (newProvisionsState: ManageDocTypeProvision[]) => {
    setUpdatedProvisions(newProvisionsState);
  };

  const saveButtonHandler = async () => {
    await saveDocType();
    await saveProvisions();
  };

  const saveDocType = async () => {
    try {
      setLoading(true);
      console.log('Saving Doc Type...');
      // console.log(updatedDocType);
      await updateDocType(
        currentDocType.id,
        updatedDocType.name,
        updatedDocType.created_by,
        updatedDocType.created_date
      );
      refreshDocTypes();
    } catch (err) {
      console.log('Error saving doc type');
      console.log(err);
    }
  };

  const saveProvisions = async () => {
    try {
      setLoading(true);
      console.log('Saving Provisions...');
      await updateManageDocTypeProvisions(currentDocType.id, updatedProvisions);
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

          {currentDocType && (
            <RemoveDocTypeModal
              documentType={currentDocType}
              show={showRemoveDocTypeModal}
              onHide={() => setShowRemoveDocTypeModal(false)}
              onRemove={removeDocTypeHandler}
            />
          )}
        </>
      )}
      {showEdit && (
        <>
          <h1>Edit Document Type - {currentDocType.name}</h1>
          <hr />
          {/** Doc Type info / edit single row table */}
          {/** Document Type Name - Date Created - Created By - Last Updated Date - Last Updated By */}
          <EditDocTypeTable documentType={[currentDocType]} onUpdate={handleUpdateDocTypeState} />
          <hr />
          <h1>Associate Provisions to {currentDocType.name}</h1>
          <hr />
          {/** Search implementation */}
          {/** Advanced Search: different inputs - id, type, group, free text, category */}
          <Row className="mt-3">
            <DocumentProvisionSearch onSearch={setSearchStateHandler} />
            {/** Name/group search box - Advanced Search - Associated - Edit Provision Groups*/}
            <Col sm={4}>
              <Button variant="primary" onClick={() => setShowEditProvisionGroupsModal(true)}>
                Edit Provision Groups
              </Button>
            </Col>
          </Row>

          {/** Global Provisions table */}
          <ManageDocumentProvisionsTable
            documentTypeId={currentDocType.id}
            provisions={provisions}
            provisionGroups={provisionGroups}
            searchState={searchState}
            refreshTables={refreshTables}
            onUpdate={updateProvisionsState}
          />
          {/** ID - Type - Group - Seq - Max - Provision Name - Free Text - Category - Associated */}
          <EditProvisionGroupsModal
            provisionGroups={provisionGroups}
            documentTypeId={currentDocType.id}
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
        </>
      )}
    </>
  );
};

export default ManageDocumentsPage;
