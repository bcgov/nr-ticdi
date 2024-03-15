import React from 'react';

interface LicenseDetailProps {
  type: string;
  subtype: string;
  purpose: string;
  subpurpose: string;
  locationOfLand: string;
  mailingAddress1: string;
  mailingAddress2: string;
  mailingAddress3: string;
}

const LicenseDetailDisplay: React.FC<LicenseDetailProps> = ({
  type,
  subtype,
  purpose,
  subpurpose,
  locationOfLand,
  mailingAddress1,
  mailingAddress2,
  mailingAddress3
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }} className='text_size'>
      <div>
        <div><strong>Type</strong></div>
        <div className='margin_bottom'>{type}</div>
        <div><strong>Subtype</strong></div>
        <div className='margin_bottom'>{subtype}</div>
        <div><strong>Purpose</strong></div>
        <div className='margin_bottom'>{purpose}</div>
        <div><strong>Subpurpose</strong></div>
        <div className='margin_bottom'>{subpurpose}</div>
        <div><strong>Location of Land</strong></div>
        <div className='margin_bottom'>{locationOfLand}</div>
      </div>
      <div>
        <div><strong>Primary Contact Address</strong></div>
        <div>{mailingAddress1}</div>
        <div>{mailingAddress2}</div>
        <div>{mailingAddress3}</div>
      </div>
    </div>
  );
};

export default LicenseDetailDisplay;
