import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { activateTemplate, downloadTemplate, getTemplatesInfo } from '../../../common/manage-templates';
import { DocType, TemplateInfo } from '../../../types/types';
import { Button } from 'react-bootstrap';

interface TemplateInfoTableProps {
  documentType: DocType;
  refreshVersion: number;
  handleRemove: (id: number) => void;
}

const TemplateInfoTable: React.FC<TemplateInfoTableProps> = ({ documentType, refreshVersion, handleRemove }) => {
  const [templateData, setTemplateData] = useState<TemplateInfo[]>([]);
  const [currentlyActive, setCurrentlyActive] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

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
  }, [documentType, refreshVersion]);

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

  // this opens a modal which is handled on the ManageTemplatesPage
  const handleRemoveButton = (id: number) => {
    handleRemove(id);
  };

  const columnHelper = createColumnHelper<TemplateInfo>();

  const columns: ColumnDef<TemplateInfo, any>[] = [
    columnHelper.accessor('template_version', {
      id: 'template_version',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Doc No.',
      enableSorting: true,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('file_name', {
      id: 'file_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Template Name',
      enableSorting: true,
      meta: { customCss: { width: '50%' } },
    }),
    columnHelper.accessor('update_timestamp', {
      id: 'update_timestamp',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
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
        <Button variant="success" onClick={() => console.log('')}>
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
          View Doc
        </Button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '12%' } },
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
    <DataTable
      columns={columns}
      data={templateData}
      enableSorting={true}
      initialSorting={[{ id: 'template_version', desc: false }]}
    />
  );
};

export default TemplateInfoTable;
