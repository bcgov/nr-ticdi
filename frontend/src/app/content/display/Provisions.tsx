import { FC, useEffect, useState } from 'react';
import { NfrDataObject, ProvisionGroup } from '../../types/types';
import { NFR_VARIANTS } from '../../util/constants';
import { getGroupMaxByVariant, getNfrDataByDtid } from '../../common/report';
import ProvisionsTable from '../../components/table/ProvisionsTable';
import SelectedProvisionsTable from '../../components/table/SelectedProvisionsTable';

interface ProvisionsProps {
  dtid: number;
  variantName: string;
}

const Provisions: FC<ProvisionsProps> = ({ dtid, variantName }) => {
  const [nfrData, setNfrData] = useState<NfrDataObject | null>(null);
  const [selectedProvisionIds, setSelectedProvisionIds] = useState<number[]>([]);
  const [selectedVariableIds, setSelectedVariableIds] = useState<number[]>([]);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[] | null>(null);
  const [selectedProvisionGroup, setSelectedProvisionGroup] = useState<number | null>(null);
  const [viewedProvisionGroups, setViewedProvisionGroups] = useState<Set<number>>(new Set());
  console.log('selectedProvisionIds');
  console.log(selectedProvisionIds);

  // Fetch NFR data if we are on the NFR page
  useEffect(() => {
    const fetchData = async () => {
      if (NFR_VARIANTS.includes(variantName?.toUpperCase())) {
        if (dtid) {
          const nfrData: NfrDataObject = await getNfrDataByDtid(dtid);
          console.log('nfrData');
          console.log(nfrData);
          setNfrData(nfrData);
          setSelectedProvisionIds(nfrData?.provisionIds);
          setSelectedVariableIds(nfrData?.variableIds);
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
    const value = event.target.value;
    setSelectedProvisionGroup(parseInt(value));

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
              className={viewedProvisionGroups.has(pg.id) ? 'option-viewed' : 'option-default'}
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
        selectedProvisionIds={selectedProvisionIds}
        selectProvision={selectProvisionHandler}
      />
      <hr style={{ marginLeft: '0', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
      <div style={{ fontWeight: 'bold' }}>Selected Provisions</div>
      <SelectedProvisionsTable dtid={dtid} variant={variantName} selectedProvisionIds={selectedProvisionIds} />
    </>
  );
};

export default Provisions;
