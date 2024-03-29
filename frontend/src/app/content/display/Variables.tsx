import { FC, useEffect, useState } from 'react';
import { getDocumentVariablesByDocTypeIdDtid } from '../../common/report';
import VariablesTable, { VariableJson } from '../../components/table/reports/VariablesTable';
import { DocType, Provision, Variable } from '../../types/types';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';

interface VariablesProps {
  dtid: number;
  documentType: DocType;
  updateHandler: (variableJson: VariableJson[]) => void;
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
  provision: Provision;
};

const Variables: FC<VariablesProps> = ({ dtid, documentType, updateHandler }) => {
  // const [allVariables, setAllVariables] = useState<VariableData[]>([]);

  return (
    <>
      <VariablesTable />
    </>
  );
};

export default Variables;
