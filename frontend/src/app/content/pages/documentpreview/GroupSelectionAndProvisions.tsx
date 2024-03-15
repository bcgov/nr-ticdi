import React from 'react';
import './GroupSelectionAndProvisions.scss';

interface Provision {
  type: string;
  provision: string;
  freeText: string;
  category: string;
  included: boolean;
}

interface GroupSelectionAndProvisionsProps {
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  provisions: Provision[];
  handleCheckboxChange: (index: number) => void;
}

const GroupSelectionAndProvisions: React.FC<GroupSelectionAndProvisionsProps> = ({
  selectedGroup,
  setSelectedGroup,
  provisions,
  handleCheckboxChange,
}) => {
  return (
    <>
      <div className="document-preview">


        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Provision</th>
              <th>Free Text</th>
              <th>Category</th>
              <th>Included</th>
            </tr>
          </thead>
          <tbody>
            {provisions.map((item, index) => (
              <tr key={index}>
                <td><input type="text" value={item.type} readOnly /></td>
                <td><input type="text" value={item.provision} readOnly /></td>
                <td><input type="text" value={item.freeText} readOnly /></td>
                <td><input type="text" value={item.category} readOnly /></td>
                <td><input type="checkbox" checked={item.included} onChange={() => handleCheckboxChange(index)} /></td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>
    </>
  );
};

export default GroupSelectionAndProvisions;
