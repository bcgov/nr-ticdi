/**
 * Used on the ReportPage variables section, it allows you
 * to edit variable values without re-rendering the table
 */
import React, { useState } from 'react';

interface VariableValueCellProps {
  value: string;
  updateValue: (v: number, i: string) => void;
  variableId: number;
}

const VariableValueCell: React.FC<VariableValueCellProps> = ({ value, updateValue, variableId }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = () => {
    updateValue(variableId, inputValue);
  };

  return (
    <input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      style={{ width: '100%' }}
    />
  );
};

export default VariableValueCell;
