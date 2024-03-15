import React from 'react';
import { Row, Col } from 'react-bootstrap';

interface ContactInfoProps {
  contactName: string;
  organizationUnit: string | number;
  incorporationNumber: string | number;
  emailAddress: string;
  dateInspected: string;
}

const ContactInfoDisplay: React.FC<ContactInfoProps> = ({
  contactName,
  organizationUnit,
  incorporationNumber,
  emailAddress,
  dateInspected,
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className='text_size'>
        <Col sm={4}>
          <div>
            <div><strong>Contact or Agent Name</strong></div>
            <div className='margin_bottom'>{contactName}</div>

            <div><strong>Organization Unit</strong></div>
            <div className='margin_bottom'>{organizationUnit}</div>

            <div><strong>Incorporation Number</strong></div>
            <div className='margin_bottom'>{incorporationNumber}</div>
          </div>
        </Col>
        <Col sm={4}>
          <div>
            <div><strong>Email Address</strong></div>
            <div className='margin_bottom'>{emailAddress}</div>

            <div><strong>Date Inspected</strong></div>
            <div className='margin_bottom'>{dateInspected}</div>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default ContactInfoDisplay;
