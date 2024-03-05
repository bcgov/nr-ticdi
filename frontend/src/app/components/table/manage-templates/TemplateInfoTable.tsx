import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { TemplateInfo, activateTemplate, downloadTemplate, getTemplatesInfo } from '../../../common/manage-templates';
import Button from '../../common/Button';

export type SearchData = {
  template_version: number;
  file_name: string;
  update_timestamp: string;
  active_flag: boolean;
  view: any;
  remove: any;
  id: number;
};

interface TemplateInfoTableProps {
  reportType: string;
  refreshVersion: number;
  handleRemove: (id: number, reportType: string) => void;
}

const TemplateInfoTable: React.FC<TemplateInfoTableProps> = ({ reportType, refreshVersion, handleRemove }) => {
  const [templateData, setTemplateData] = useState<TemplateInfo[]>([]);
  const [currentlyActive, setCurrentlyActive] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTemplatesInfo(reportType);
      setTemplateData(data);
      for (let template of data) {
        if (template.active_flag === true) {
          setCurrentlyActive(template.id);
        }
      }
    };

    fetchData();
  }, [reportType, refreshVersion]);

  const activeRadioHandler = async (id: number) => {
    try {
      setLoading(true);
      await activateTemplate(id, reportType);
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
      await downloadTemplate(id, fileName);
    } catch (error) {
      console.log('Error downloading template');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // this opens a modal which is handled on the ManageTemplatesPage
  const handleRemoveButton = (id: number) => {
    handleRemove(id, reportType);
  };

  const columnHelper = createColumnHelper<SearchData>();

  const columns: ColumnDef<SearchData, any>[] = [
    columnHelper.accessor('template_version', {
      id: 'template_version',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '40px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Doc No.',
      meta: { customCss: { minWidth: '40px', width: '40px' } },
    }),
    columnHelper.accessor('file_name', {
      id: 'file_name',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '400px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Template Name',
      meta: { customCss: { minWidth: '400px', width: '400px' } },
    }),
    columnHelper.accessor('update_timestamp', {
      id: 'update_timestamp',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '80px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Uploaded Date',
      meta: { customCss: { minWidth: '80px', width: '80px' } },
    }),
    columnHelper.accessor('active_flag', {
      id: 'active_flag',
      cell: (info) => (
        <input
          type="radio"
          name={`activeSelection_${reportType}`}
          checked={currentlyActive === info.row.original.id}
          onChange={() => activeRadioHandler(info.row.original.id)}
          style={{ minWidth: '40px', marginTop: '10px' }}
          disabled={loading}
        />
      ),
      header: () => 'Active',
      meta: { customCss: { minWidth: '40px', width: '40px' } },
    }),
    columnHelper.accessor('view', {
      id: 'view',
      cell: (info) => (
        <Button
          type="btn-info"
          onClick={() => handleDownloadTemplate(info.row.original.id, info.row.original.file_name)}
          text="View"
        ></Button>
      ),
      header: () => null,
    }),
    columnHelper.accessor('remove', {
      id: 'remove',
      cell: (info) => (
        <Button type="btn-warning" onClick={() => handleRemoveButton(info.row.original.id)} text="Remove"></Button>
      ),
      header: () => null,
      meta: { customCss: { paddingLeft: '10px' } },
    }),
    columnHelper.accessor('id', {
      id: 'id',
      cell: () => null,
      header: () => null,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return <DataTable columns={columns} data={templateData} />;
};

export default TemplateInfoTable;
