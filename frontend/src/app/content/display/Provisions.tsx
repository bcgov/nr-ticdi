import { FC, useEffect, useState } from 'react';
import { NfrDataObject, ProvisionGroup } from '../../types/types';
import { NFR_VARIANTS } from '../../util/constants';
import { getGroupMaxByVariant, getNfrDataByDtid } from '../../common/report';

interface ProvisionsProps {
  dtid: number;
  variantName: string;
}

// receive nfr data, provisions,
const Provisions: FC<ProvisionsProps> = ({ dtid, variantName }) => {
  const [nfrData, setNfrData] = useState<NfrDataObject | null>(null);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[] | null>(null);
  const [selectedProvisionGroup, setSelectedProvisionGroup] = useState<string | undefined>();
  const [viewedProvisionGroups, setViewedProvisionGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      // Fetch NFR data if we are on the NFR page
      if (NFR_VARIANTS.includes(variantName?.toUpperCase())) {
        if (dtid) {
          const nfrData: NfrDataObject = await getNfrDataByDtid(dtid);
          console.log(nfrData);
          setNfrData(nfrData);
        }
        const provisionGroupsObject: ProvisionGroup[] = await getGroupMaxByVariant(variantName);
        console.log(provisionGroupsObject);
        setProvisionGroups(provisionGroupsObject);
      }
    };
    fetchData();
  }, [dtid, variantName]);

  const handleProvisionGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedProvisionGroup(value);

    if (value) {
      setViewedProvisionGroups((prevViewedProvisionGroups) => {
        const updatedViewedProvisionGroups = new Set(prevViewedProvisionGroups);
        updatedViewedProvisionGroups.add(Number(value));
        return updatedViewedProvisionGroups;
      });
    }
  };

  return (
    <>
      <select value={selectedProvisionGroup} onChange={handleProvisionGroupChange}>
        <option value="">Select an option</option>
        {provisionGroups?.map((pg) => (
          <option key={pg.id} value={pg.id} className={viewedProvisionGroups.has(pg.id) ? 'viewed' : ''}>
            {pg.provision_group_text}
          </option>
        ))}
      </select>
    </>
  );
};

export default Provisions;
