import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  activateTemplate,
  downloadTemplate,
  getTemplatesInfo,
  previewTemplate,
} from '../../../common/manage-templates';
import { DocType, TemplateInfo } from '../../../types/types';
import { Button } from 'react-bootstrap';
import PreviewTemplateModal from '../../modal/manage-templates/PreviewTemplateModal';
import EditTemplateModal from '../../modal/manage-templates/EditTemplateModal';

interface TemplateInfoTableProps {
  documentType: DocType;
  refreshVersion: number;
  handleRemove: (id: number) => void;
}

const TemplateInfoTable: React.FC<TemplateInfoTableProps> = ({ documentType, refreshVersion, handleRemove }) => {
  const [templateData, setTemplateData] = useState<TemplateInfo[]>([]);
  const [currentlyActive, setCurrentlyActive] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [isEditModalOpen, setisEditModalOpen] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<number>(10);
  const [documentName, setDocumentName] = useState<string>('');
  const [documentVersion, setDocumentVersion] = useState<number>(10);
  const [isTemplateUpdated, setTemplateUpdated] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTemplatesInfo(documentType.id);
      setTemplateData(data);
      for (let template of data) {
        if (template.active_flag === true) {
          setCurrentlyActive(template.id);
        }
      }
    };

    fetchData();
  }, [documentType, refreshVersion, isTemplateUpdated]);

  const activeRadioHandler = async (id: number) => {
    try {
      setLoading(true);
      await activateTemplate(id, documentType.id);
      setCurrentlyActive(id);
    } catch (error) {
      console.log('Error activating template');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async (id: number, fileName: string) => {
    try {
      setLoading(true);
      await downloadTemplate(id, fileName + '.docx');
    } catch (error) {
      console.log('Error downloading template');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handlePreviewTemplate = async (id: number) => {
    try {
      setLoading(true);
      setPreviewId(id);
      // const response = await previewTemplate(id, fileName);
      // if (response) {
      //   setPdfBlob(response);
      setIsOpen(true);
      setLoading(false);
      // }
    } catch (error) {
      console.log('Error downloading template');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = async (id: number, fileName: string, version: number) => {
    setDocumentId(id);
    setDocumentName(fileName);
    setDocumentVersion(version);
    setisEditModalOpen(true);
  };

  // this opens a modal which is handled on the ManageTemplatesPage
  const handleRemoveButton = (id: number) => {
    handleRemove(id);
  };

  const onTemplateUpdated = () => {
    setTemplateUpdated(!isTemplateUpdated);
    setisEditModalOpen(false);
  };

  const columnHelper = createColumnHelper<TemplateInfo>();

  const columns: ColumnDef<TemplateInfo, any>[] = [
    columnHelper.accessor('template_version', {
      id: 'template_version',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Doc No.',
      enableSorting: true,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('file_name', {
      id: 'file_name',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Template Name',
      enableSorting: true,
      meta: { customCss: { width: '50%' } },
    }),
    columnHelper.accessor('update_timestamp', {
      id: 'update_timestamp',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Uploaded Date',
      enableSorting: true,
      meta: { customCss: { width: '15%' } },
    }),
    columnHelper.accessor('active_flag', {
      id: 'active_flag',
      cell: (info) => (
        <input
          type="radio"
          name={`activeSelection_document`}
          checked={currentlyActive === info.row.original.id}
          onChange={() => activeRadioHandler(info.row.original.id)}
          style={{ width: '100%' }}
          disabled={loading}
        />
      ),
      header: () => 'Active',
      enableSorting: false,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('preview', {
      id: 'preview',
      cell: (info) => (
        <Button variant="success" onClick={() => handlePreviewTemplate(info.row.original.id)}>
          Preview
        </Button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('view', {
      id: 'view',
      cell: (info) => (
        <Button
          variant="info"
          onClick={() => handleDownloadTemplate(info.row.original.id, info.row.original.file_name)}
        >
          Download
        </Button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '12%' } },
    }),
    columnHelper.accessor('edit', {
      id: 'edit',
      cell: (info) => (
        <Button
          variant="primary"
          onClick={() =>
            handleEditTemplate(info.row.original.id, info.row.original.file_name, info.row.original.template_version)
          }
          style={{ width: '100%' }}
        >
          Edit
        </Button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '11%' } },
    }),
    columnHelper.accessor('remove', {
      id: 'remove',
      cell: (info) => (
        <Button variant="warning" onClick={() => handleRemoveButton(info.row.original.id)}>
          Remove
        </Button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '15%' } },
    }),
    columnHelper.accessor('id', {
      id: 'id',
      cell: () => null,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return (
    <>
      {isEditModalOpen && (
        <EditTemplateModal
          show={isEditModalOpen}
          documentTypeId={documentType.id}
          documentName={documentName}
          documentId={documentId}
          documentVersion={documentVersion}
          onHide={() => setisEditModalOpen(false)}
          onUpload={onTemplateUpdated}
        />
      )}
      {isOpen && previewId && <PreviewTemplateModal isOpen={isOpen} toggleModal={toggleModal} templateId={previewId} />}
      <DataTable
        columns={columns}
        data={templateData}
        enableSorting={true}
        initialSorting={[{ id: 'template_version', desc: false }]}
      />
    </>
  );
};

export default TemplateInfoTable;
