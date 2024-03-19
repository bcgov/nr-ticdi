import { FC, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { DocType } from '../../types/types';
import { getDocumentTypes } from '../../common/report';
import ManageDocTypesTable from '../../components/table/admin/ManageDocTypesTable';
import AddDocTypeModal from '../../components/modal/admin/manage-doc-types/AddDocTypeModal';
import EditDocTypeModal from '../../components/modal/admin/manage-doc-types/EditDocTypeModal';
import RemoveDocTypeModal from '../../components/modal/admin/manage-doc-types/RemoveDocTypeModal';
import { addDocType, removeDocType, updateDocType } from '../../common/manage-doc-types';

const ManageDocumentsPage: FC = () => {
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

  const [showAddDocTypeModal, setShowAddDocTypeModal] = useState<boolean>(false);
  const [showEditDocTypeModal, setShowEditDocTypeModal] = useState<boolean>(false);
  const [showRemoveDocTypeModal, setShowRemoveDocTypeModal] = useState<boolean>(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const docTypeData = await getDocumentTypes();
      setAllDocTypes(docTypeData);
    };
    getData();
  }, [refreshTrigger]);

  const refreshTables = () => {
    setRefreshTrigger((prev) => prev + 1);
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

  const openEditDocTypeModal = (id: number) => {
    const selectedDocType = allDocTypes.find((docType) => docType.id === id);
    if (selectedDocType) {
      setCurrentDocType(selectedDocType);
      setShowEditDocTypeModal(true);
    }
  };

  const editDocTypeHandler = async (id: number, name: string, created_by: string, created_date: string) => {
    try {
      await updateDocType(id, name, created_by, created_date);
      refreshTables();
    } catch (err) {
      console.log('Error updating doc type');
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
      refreshTables();
    } catch (err) {
      console.log('Error removing doc type');
      console.log(err);
    }
  };

  return (
    <>
      <h1>Manage Document Types</h1>
      <hr />
      <ManageDocTypesTable
        documentTypes={allDocTypes}
        handleEdit={openEditDocTypeModal}
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
        <EditDocTypeModal
          documentType={currentDocType}
          allDocTypes={allDocTypes}
          show={showEditDocTypeModal}
          onHide={() => setShowEditDocTypeModal(false)}
          onEdit={editDocTypeHandler}
        />
      )}

      {currentDocType && (
        <RemoveDocTypeModal
          documentType={currentDocType}
          show={showRemoveDocTypeModal}
          onHide={() => setShowRemoveDocTypeModal(false)}
          onRemove={removeDocTypeHandler}
        />
      )}
    </>
  );
};

export default ManageDocumentsPage;
