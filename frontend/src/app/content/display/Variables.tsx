import { FC, useEffect, useState } from 'react';
import { getDocumentVariablesByDocTypeIdDtid } from '../../common/report';
import VariablesTable, { VariableJson } from '../../components/table/reports/VariablesTable';
import { DocType } from '../../types/types';
import { ProvisionData } from './Provisions';

interface VariablesProps {
  dtid: number;
  documentType: DocType;
  updateHandler: (variableJson: VariableJson[]) => void;
  selectedProvisionIds: number[];
}

export type VariableData = {
  id: number;
  variable_name: string;
  variable_value: string;
  help_text: string;
  create_userid: string;
  update_userid: string;
  create_timestamp: string;
  update_timestamp: string;
  provision: ProvisionData;
};

const Variables: FC<VariablesProps> = ({ dtid, documentType, updateHandler, selectedProvisionIds }) => {
  const [allVariables, setAllVariables] = useState<VariableData[]>([]);
  const [variableIds, setVariableIds] = useState<number[]>([]);
  const [filteredVariables, setFilteredVariables] = useState<VariableData[]>([]); // provisions in the currently selected group

  useEffect(() => {
    const getData = async () => {
      const variableData: { variables: VariableData[]; variableIds: number[] } =
        await getDocumentVariablesByDocTypeIdDtid(documentType.id, dtid);
      setAllVariables(variableData.variables);
      setVariableIds(variableIds);
    };
    getData();
  }, [dtid, documentType]);

  useEffect(() => {
    console.log(allVariables);
    const filtered: VariableData[] | null = allVariables
      ? allVariables.filter((variable) => selectedProvisionIds.includes(variable.provision.id))
      : null;
    if (filtered) setFilteredVariables(filtered);
  }, [allVariables, selectedProvisionIds]);

  return (
    <>
      <VariablesTable variables={filteredVariables} updateHandler={updateHandler} />
    </>
  );
};

export default Variables;
