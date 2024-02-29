import { FC, useEffect, useState } from 'react';
import { getNfrVariablesByVariantDtid } from '../../common/report';
import VariablesTable, { VariableJson } from '../../components/table/VariablesTable';

interface VariablesProps {
  dtid: number;
  variantName: string;
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
  provisionId: number;
};

const Variables: FC<VariablesProps> = ({ dtid, variantName, updateHandler, selectedProvisionIds }) => {
  const [allVariables, setAllVariables] = useState<VariableData[]>([]);
  const [filteredVariables, setFilteredVariables] = useState<VariableData[]>([]); // provisions in the currently selected group

  useEffect(() => {
    const getData = async () => {
      const variables: VariableData[] = await getNfrVariablesByVariantDtid(variantName, dtid);
      setAllVariables(variables);
    };
    getData();
  }, [dtid, variantName]);

  useEffect(() => {
    const filtered: VariableData[] = allVariables.filter((variable) =>
      selectedProvisionIds.includes(variable.provisionId)
    );
    setFilteredVariables(filtered);
  }, [allVariables, selectedProvisionIds]);

  return (
    <>
      <VariablesTable variables={filteredVariables} updateHandler={updateHandler} />
    </>
  );
};

export default Variables;
