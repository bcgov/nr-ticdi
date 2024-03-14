import React from 'react';

interface Provision {
  type: string;
  provision: string;
}

interface ProvisionsTableProps {
  provisions: Provision[];
}

const ProvisionsTable: React.FC<ProvisionsTableProps> = ({ provisions }) => {
  const handleInputChange = (index: number, field: keyof Provision, value: string) => {
    const updatedProvisions = provisions.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    //setProvisions(updatedProvisions);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Document Variable Name</th>
            <th>Enter Text</th>
          </tr>
        </thead>
        <tbody>
          {provisions.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={item.type}
                  onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.provision}
                  onChange={(e) => handleInputChange(index, 'provision', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='variable--algin'>
        <label htmlFor="variableName" className='help--algin'>Variable</label>
        <input
          id="variableName"
          type="text"
          onChange={(e) => {/* setVariableName(e.target.value) */ }}
        />
      </div>
      <div className='variable--algin'>
        <label htmlFor="helpText" className='help--algin'>Help Text</label>
        <input
          id="helpText"
          type="text"
          onChange={(e) => {/* setHelpText(e.target.value) */ }}
        />
      </div>

    </>

  );
};

export default ProvisionsTable;
