import { FC, useEffect, useState } from 'react';
import { getDocumentVariablesByDocTypeIdDtid } from '../../common/report';
import VariablesTable, { VariableJson } from '../../components/table/reports/VariablesTable';
import { DocumentType } from '../../types/types';

interface VariablesProps {
  dtid: number;
  documentType: DocumentType;
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

const Variables: FC<VariablesProps> = ({ dtid, documentType, updateHandler, selectedProvisionIds }) => {
  const [allVariables, setAllVariables] = useState<VariableData[]>([]);
  const [filteredVariables, setFilteredVariables] = useState<VariableData[]>([]); // provisions in the currently selected group

  useEffect(() => {
    const getData = async () => {
      const variables: VariableData[] = await getDocumentVariablesByDocTypeIdDtid(documentType.id, dtid);
      setAllVariables(variables);
    };
    getData();
  }, [dtid, documentType]);

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
