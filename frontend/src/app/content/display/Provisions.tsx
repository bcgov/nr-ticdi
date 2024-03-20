import { FC, useEffect, useState } from 'react';
import { DocType, DocumentDataObject, ProvisionGroup } from '../../types/types';
import { getDocumentDataByDocTypeIdAndDtid } from '../../common/report';
import ProvisionsTable from '../../components/table/reports/ProvisionsTable';
import SelectedProvisionsTable, { ProvisionJson } from '../../components/table/reports/SelectedProvisionsTable';

interface ProvisionsProps {
  dtid: number;
  documentType: DocType;
  provisionGroups: ProvisionGroup[] | undefined;
  updateHandler: (provisionJson: ProvisionJson[]) => void;
  updateSelectedProvisionIds: (selectedProvisionIds: number[]) => void;
}

export type ProvisionData = {
  id: number;
  type: string;
  provision_name: string;
  free_text: string;
  category: string;
  active_flag: boolean;
  create_userid: string;
  update_userid: string;
  help_text: string;
  create_timestamp: string;
  update_timestamp: string;
  select: boolean;
  max: number;
  provision_group: ProvisionGroup;
  is_deleted: boolean;
};

const Provisions: FC<ProvisionsProps> = ({
  dtid,
  documentType,
  provisionGroups,
  updateHandler,
  updateSelectedProvisionIds,
}) => {
  const [selectedProvisionIds, setSelectedProvisionIds] = useState<number[]>([]);
  const [selectedProvisionGroup, setSelectedProvisionGroup] = useState<number | null>(null);
  const [selectedProvisionGroupMax, setSelectedProvisionGroupMax] = useState<number | null>(null);
  const [viewedProvisionGroups, setViewedProvisionGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (dtid && documentType && documentType.id) {
        const documentData: DocumentDataObject = await getDocumentDataByDocTypeIdAndDtid(documentType.id, dtid);
        if (documentData) {
          setSelectedProvisionIds(documentData.provisionIds);
        }
      }
    };
    fetchData();
  }, [dtid, documentType.id]);

  const handleProvisionGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    setSelectedProvisionGroup(value);
    const provisionGroup = provisionGroups?.find((pg) => value === pg.provision_group);
    const pgMax = provisionGroup ? provisionGroup.max : 999;
    setSelectedProvisionGroupMax(pgMax);

    if (value) {
      setViewedProvisionGroups((prevViewedProvisionGroups) => {
        const updatedViewedProvisionGroups = new Set(prevViewedProvisionGroups);
        updatedViewedProvisionGroups.add(Number(value));
        return updatedViewedProvisionGroups;
      });
    }
  };

  const selectProvisionHandler = (id: number, selected: boolean) => {
    setSelectedProvisionIds((prevIds) => {
      const updatedIds = new Set(prevIds);
      if (selected) {
        updatedIds.add(id);
      } else {
        updatedIds.delete(id);
      }
      return Array.from(updatedIds);
    });
  };

  useEffect(() => {
    updateSelectedProvisionIds(selectedProvisionIds);
  }, [selectedProvisionIds]);

  return (
    <>
      <div>
        <label htmlFor="provisionGroupSelect" style={{ marginRight: '10px' }}>
          Select A Group
        </label>
        <select
          id="provisionGroupSelect"
          value={selectedProvisionGroup || ''}
          onChange={handleProvisionGroupChange}
          className="select-provision-group"
        >
          <option>Select</option>
          {provisionGroups?.map((pg) => (
            <option
              key={pg.id}
              value={pg.provision_group}
              className={viewedProvisionGroups.has(+pg.provision_group) ? 'option-viewed' : 'option-default'}
            >
              {pg.provision_group + ' - ' + pg.provision_group_text}
            </option>
          ))}
        </select>
      </div>
      <ProvisionsTable
        dtid={dtid}
        docType={documentType}
        currentGroupNumber={selectedProvisionGroup}
        currentGroupMax={selectedProvisionGroupMax}
        selectedProvisionIds={selectedProvisionIds}
        selectProvision={selectProvisionHandler}
      />
      <hr style={{ marginLeft: '0', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
      <div style={{ fontWeight: 'bold' }}>Selected Provisions</div>
      <SelectedProvisionsTable
        dtid={dtid}
        docType={documentType}
        selectedProvisionIds={selectedProvisionIds}
        updateHandler={updateHandler}
      />
    </>
  );
};

export default Provisions;
