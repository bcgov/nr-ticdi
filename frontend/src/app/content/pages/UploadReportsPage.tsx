import { FC, useEffect, useState } from 'react';
import TemplateInfoTable from '../../components/table/manage-templates/TemplateInfoTable';
import { Button } from 'react-bootstrap';
import { DocType } from '../../types/types';
import UploadTemplateModal from '../../components/modal/manage-templates/UploadTemplateModal';
import RemoveTemplateModal from '../../components/modal/manage-templates/RemoveTemplateModal';
import { getDocumentTypes } from '../../common/report';

// switch the name of this page to manage templates after manage provisions/variables page is created

const UploadReportsPage: FC = () => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showRemoveTemplateModal, setShowRemoveTemplateModal] = useState<boolean>(false);
  const [currentReportId, setCurrentReportId] = useState<number>(-1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDocType, setSelectedDocType] = useState<DocType>();
  const [allDocTypes, setAllDocTypes] = useState<DocType[]>([]);

  useEffect(() => {
    const getData = async () => {
      const docTypeData = await getDocumentTypes();
      setAllDocTypes(docTypeData);
    };
    getData();
  }, []);

  useEffect(() => {
    refreshTables();
  }, [selectedDocType]);

  const refreshTables = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const openRemoveTemplateModal = (id: number) => {
    setCurrentReportId(id);
    setShowRemoveTemplateModal(true);
  };

  const selectedDocTypeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const docTypeId: number = parseInt(event.target.value);
    setSelectedDocType(allDocTypes.find((docType) => docType.id === docTypeId));
  };

  return (
    <>
      <h1>Manage Templates</h1>
      <hr />
      <div className="col-md-3">
        <h4>Select a Template:</h4>
      </div>
      <div className="form-group row">
        <div className="col-md-4">
          <select
            id="reportTypes"
            style={{ minWidth: '200px' }}
            className="border border-1 rounded pl-2 ml-4"
            onChange={selectedDocTypeHandler}
          >
            <option key="none" value={-1}></option>
            {allDocTypes.map((docType) => (
              <option key={docType.id} value={docType.id}>
                {docType.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedDocType && (
        <>
          <TemplateInfoTable
            documentType={selectedDocType}
            refreshVersion={refreshTrigger}
            handleRemove={openRemoveTemplateModal}
          />
          <Button variant="success" onClick={() => openUploadModal()}>
            Upload New Version
          </Button>
          <UploadTemplateModal
            show={showUploadModal}
            onHide={() => setShowUploadModal(false)}
            onUpload={refreshTables}
            documentTypeId={selectedDocType.id}
            documentTypeName={selectedDocType.name}
          />
          <RemoveTemplateModal
            show={showRemoveTemplateModal}
            onHide={() => setShowRemoveTemplateModal(false)}
            onRemove={refreshTables}
            documentTypeId={selectedDocType.id}
            documentTypeName={selectedDocType.name}
            templateId={currentReportId}
          />
        </>
      )}
    </>
  );
};

export default UploadReportsPage;
