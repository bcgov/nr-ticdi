import { FC, useEffect, useState } from 'react';
import { NfrDataObject, ProvisionGroup } from '../../types/types';
import { NFR_VARIANTS } from '../../util/constants';
import { getGroupMaxByVariant, getNfrDataByDtid } from '../../common/report';
import ProvisionsTable from '../../components/table/reports/ProvisionsTable';
import SelectedProvisionsTable, { ProvisionJson } from '../../components/table/reports/SelectedProvisionsTable';

interface ProvisionsProps {
  dtid: number;
  variantName: string;
  updateHandler: (provisionJson: ProvisionJson[]) => void;
  updateSelectedProvisionIds: (selectedProvisionIds: number[]) => void;
}

export type ProvisionData = {
  type: string;
  provision_name: string;
  free_text: string;
  category: string;
  active_flag: boolean;
  create_userid: string;
  update_userid: string;
  provision_variant: [
    {
      id: number;
      variant_name: string;
    }
  ];
  id: number;
  help_text: string;
  create_timestamp: string;
  update_timestamp: string;
  select: boolean;
  max: number;
  provision_group: number;
};

const Provisions: FC<ProvisionsProps> = ({ dtid, variantName, updateHandler, updateSelectedProvisionIds }) => {
  const [nfrData, setNfrData] = useState<NfrDataObject | null>(null);
  const [selectedProvisionIds, setSelectedProvisionIds] = useState<number[]>([]);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[] | null>(null);
  const [selectedProvisionGroup, setSelectedProvisionGroup] = useState<number | null>(null);
  const [selectedProvisionGroupMax, setSelectedProvisionGroupMax] = useState<number | null>(null);
  const [viewedProvisionGroups, setViewedProvisionGroups] = useState<Set<number>>(new Set());

  // Fetch NFR data if we are on the NFR page
  useEffect(() => {
    const fetchData = async () => {
      if (NFR_VARIANTS.includes(variantName?.toUpperCase())) {
        if (dtid) {
          const nfrData: NfrDataObject = await getNfrDataByDtid(dtid);
          if (nfrData) {
            setNfrData(nfrData);
            setSelectedProvisionIds(nfrData.provisionIds);
          }
        }
        const provisionGroupsObject: ProvisionGroup[] = await getGroupMaxByVariant(variantName);
        setProvisionGroups(provisionGroupsObject);
      }
    };
    fetchData();
  }, [dtid, variantName]);

  // reset the selected and viewed provisions on variant change
  useEffect(() => {
    setViewedProvisionGroups(new Set());
    setSelectedProvisionGroup(null);
  }, [variantName]);

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
        variant={variantName}
        currentGroupNumber={selectedProvisionGroup}
        currentGroupMax={selectedProvisionGroupMax}
        selectedProvisionIds={selectedProvisionIds}
        selectProvision={selectProvisionHandler}
      />
      <hr style={{ marginLeft: '0', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
      <div style={{ fontWeight: 'bold' }}>Selected Provisions</div>
      <SelectedProvisionsTable
        dtid={dtid}
        variant={variantName}
        selectedProvisionIds={selectedProvisionIds}
        updateHandler={updateHandler}
      />
    </>
  );
};

export default Provisions;
