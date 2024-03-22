import { FC, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { DocType, ProvisionGroup } from '../../types/types';
import { getDocumentTypes, getGroupMaxByDocTypeId } from '../../common/report';
import ManageDocTypesTable from '../../components/table/manage-doc-types/ManageDocTypesTable';
import AddDocTypeModal from '../../components/modal/manage-doc-types/AddDocTypeModal';
import EditDocTypeModal from '../../components/modal/manage-doc-types/EditDocTypeModal';
import RemoveDocTypeModal from '../../components/modal/manage-doc-types/RemoveDocTypeModal';
import { addDocType, removeDocType, updateDocType } from '../../common/manage-doc-types';
import EditProvisionGroupsModal from '../../components/modal/manage-doc-types/EditProvisionGroupsModal';

const ManageDocumentsPage: FC = () => {
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
  const [allDocTypes, setAllDocTypes] = useState<DocType[]>([]);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);

  const [showAddDocTypeModal, setShowAddDocTypeModal] = useState<boolean>(false);
  const [showEditDocTypeModal, setShowEditDocTypeModal] = useState<boolean>(false);
  const [showRemoveDocTypeModal, setShowRemoveDocTypeModal] = useState<boolean>(false);
  const [showEditProvisionGroupsModal, setShowEditProvisionGroupsModal] = useState<boolean>(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const docTypeData = await getDocumentTypes();
      setAllDocTypes(docTypeData);
    };
    getData();
  }, [refreshTrigger]);

  useEffect(() => {
    const getData = async () => {
      console.log('getting groupData for currentDocType.id = ' + currentDocType.id);
      const groupData = currentDocType.id !== -1 ? await getGroupMaxByDocTypeId(currentDocType.id) : [];
      setProvisionGroups(groupData);
      console.log(groupData);
    };
    getData();
  }, [refreshTrigger, currentDocType]);

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
      refreshTables();
    } catch (err) {
      console.log('Error adding doc type');
      console.log(err);
    }
  };

  // const openEditDocTypeModal = (id: number) => {
  //   const selectedDocType = allDocTypes.find((docType) => docType.id === id);
  //   if (selectedDocType) {
  //     setCurrentDocType(selectedDocType);
  //     showEditPage();
  //   }
  // };

  // const editDocTypeHandler = async (id: number, name: string, created_by: string, created_date: string) => {
  //   try {
  //     await updateDocType(id, name, created_by, created_date);
  //     refreshTables();
  //   } catch (err) {
  //     console.log('Error updating doc type');
  //     console.log(err);
  //   }
  // };

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
      refreshTables();
    } catch (err) {
      console.log('Error removing doc type');
      console.log(err);
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

          {/* {currentDocType && (
            <EditDocTypeModal
              documentType={currentDocType}
              allDocTypes={allDocTypes}
              show={showEditDocTypeModal}
              onHide={() => setShowEditDocTypeModal(false)}
              onEdit={editDocTypeHandler}
            />
          )} */}

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
          <hr />
          <h1>Associate Provisions to {currentDocType.name}</h1>
          <hr />
          {/** Search implementation */}
          {/** Name/group search box - Advanced Search - Associated - Edit Provision Groups*/}
          <Button variant="primary" onClick={() => setShowEditProvisionGroupsModal(true)}>
            Edit Provision Groups
          </Button>
          {/** Advanced Search: different inputs - id, type, group, free text, category */}
          {/** Global Provisions table */}
          {/** ID - Type - Group - Seq - Max - Provision Name - Free Text - Category - Associated */}
          <EditProvisionGroupsModal
            provisionGroups={provisionGroups}
            show={showEditProvisionGroupsModal}
            onHide={() => setShowEditProvisionGroupsModal(false)}
          />
        </>
      )}
    </>
  );
};

export default ManageDocumentsPage;
