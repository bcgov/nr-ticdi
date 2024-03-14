import React from 'react';

interface Party {
  clientName: string;
  address: string;
}

interface InterestedPartiesDisplayProps {
  interestedParties: Party[];
}
const customDivideString = (str: string): string[] => {
  const words = str.split(' ');
  if (words.length === 2) {
    return [words[0], '', words[1]];
  } else if (words.length >= 3) {
    return [words[0], words[1], words.slice(2).join(' ')];
  }
  return words;
};


const InterestedPartiesDisplay: React.FC<InterestedPartiesDisplayProps> = ({ interestedParties }) => {

  return (
    <div style={{ padding: '10px' }}>
      {interestedParties.map((party, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
          <div>
            <div><strong>First Name</strong></div>
            <div>{customDivideString(party.clientName)[0]}</div>
          </div>
          <div>
            <div><strong>Middle Name</strong></div>
            <div>{customDivideString(party.clientName)[1] || 'N/A'}</div>
          </div>
          <div>
            <div><strong>Last Name</strong></div>
            <div>{customDivideString(party.clientName)[2] || 'N/A'}</div>
          </div>
          <div>
            <div><strong>Address</strong></div>
            <div>{party.address}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterestedPartiesDisplay;
