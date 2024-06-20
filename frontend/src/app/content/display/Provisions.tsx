import { FC, useState } from 'react';
import { DocType, ProvisionGroup, Variable } from '../../types/types';
import ProvisionsTable from '../../components/table/reports/ProvisionsTable';
import SelectedProvisionsTable from '../../components/table/reports/SelectedProvisionsTable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { deselectProvision, selectProvision } from '../../store/reducers/provisionSlice';
import { setSelectedVariableIds } from '../../store/reducers/variableSlice';

interface ProvisionsProps {
  dtid: number;
  documentType: DocType;
  provisionGroups: ProvisionGroup[] | undefined;
}

const Provisions: FC<ProvisionsProps> = ({ dtid, documentType, provisionGroups }) => {
  const [selectedProvisionGroup, setSelectedProvisionGroup] = useState<number | null>(null);
  const [selectedProvisionGroupMax, setSelectedProvisionGroupMax] = useState<number | null>(null);
  const [viewedProvisionGroups, setViewedProvisionGroups] = useState<Set<number>>(new Set());

  const dispatch = useDispatch();
  const selectedProvisionIds = useSelector((state: RootState) => state.provision.selectedProvisionIds);
  const provisions = useSelector((state: RootState) => state.provision.provisions);
  const selectedVariableIds = useSelector((state: RootState) => state.variable.selectedVariableIds);
  const variables: Variable[] = useSelector((state: RootState) => state.variable.variables);

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
    if (selected) {
      dispatch(selectProvision(id));
      // we have access to an array of selectedVariableIds
      const variableIdsToUpdate = variables?.filter((v) => v.provision_id === id)?.map((v) => v.id);
      // combine variableIdsToUpdate with selectedVariableIds on the next line
      const newSelectedVariableIds = [...new Set([...selectedVariableIds, ...variableIdsToUpdate])]; // set ensures no duplicates
      dispatch(setSelectedVariableIds(newSelectedVariableIds));
    } else {
      dispatch(deselectProvision(id));
      const variableIdsToRemove = variables?.filter((v) => v.provision_id === id)?.map((v) => v.id);
      if (variableIdsToRemove) {
        const newSelectedVariableIds = selectedVariableIds.filter((id) => !variableIdsToRemove.includes(id));
        dispatch(setSelectedVariableIds(newSelectedVariableIds));
      }
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
        <div style={{ marginLeft: '10px' }}>
          {selectedProvisionGroupMax
            ? selectedProvisionGroupMax > 100
              ? 'There is no max for this group.'
              : `Max for this group is ${selectedProvisionGroupMax}`
            : ''}
        </div>
      </div>
      <ProvisionsTable
        provisions={provisions}
        currentGroupNumber={selectedProvisionGroup}
        currentGroupMax={selectedProvisionGroupMax}
        selectedProvisionIds={selectedProvisionIds}
        selectProvision={selectProvisionHandler}
      />
      <hr style={{ marginLeft: '0', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
      <div style={{ fontWeight: 'bold' }}>Selected Provisions</div>
      <SelectedProvisionsTable
        docType={documentType}
        selectedProvisionIds={selectedProvisionIds}
        provisions={provisions}
      />
    </>
  );
};

export default Provisions;
