import React, { useState } from 'react';
import {
  getDisplayData,
  getDocumentProvisionsByDocTypeIdDtid,
  getDocumentVariablesByDocTypeIdDtid,
} from '../../../common/report';
import DocumentPreviewForm from './DocumentPreviewForm';
import ContactInfoDisplay from './ContactInfoDisplay';
import LicenseDetailDisplay from './LicenseDetailDisplay';
import InterestedPartiesDisplay from './InterestedPartiesDisplay';
import GroupSelectionAndProvisions from './GroupSelectionAndProvisions';
import ProvisionsTable from './ProvisionsTable';
import './DocumentPreview.scss';
import CustomCollapsible from './CustomCollapsible';

interface DocumentPreviewResponse {
  dtid: number;
  fileNum: string;
  primaryContactName: string;
  contactName: string;
  orgUnit: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  contactEmail: string;
  contactPhoneNumber: string;
  incorporationNum: string;
  inspectionDate: string;
  type: string;
  subType: string;
  purpose: string;
  subPurpose: string;
  mailingAddress1: string;
  mailingAddress2: string;
  mailingAddress3: string;
  locLand: string;
  areaList: Array<{
    areaInHectares: number;
    legalDescription: string;
  }>;
  interestedParties: Array<{
    clientName: string;
    address: string;
  }>;
}

interface Provision {
  type: string;
  provision: string;
  freeText: string;
  category: string;
  included: boolean;
}

type ProvisionType = {
  id: number;
  name: string;
  freeText: string;
  category: string;
  included: boolean;
};

const DocumentPreview: React.FC = () => {
  const [tenureFileNumber, setTenureFileNumber] = useState('');
  const [dtid, setDtid] = useState(''); //928437
  const [documentPreviewResponse, setDocumentPreviewResponse] = useState<DocumentPreviewResponse | null>(null);
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('110');

  const [variableName, setVariableName] = useState('');
  const [helpText, setHelpText] = useState('');

  const handleSaveForLater = () => {
    // Implement save for later logic
    console.log('Saved for later:');
  };

  const handleGenerateDocument = () => {
    console.log('Generate document with:');
  };

  const provisionsDummy: ProvisionType[] = [
    { id: 1, name: 'STANDARD LICENCE PROVISION 1', freeText: 'Lorem ipsum...', category: '', included: true },
    { id: 2, name: 'STANDARD LICENCE PROVISION 2', freeText: 'Lorem ipsum...', category: '', included: true },
    { id: 3, name: 'STANDARD LICENCE PROVISION 3', freeText: 'Lorem ipsum...', category: '', included: false },
  ];

  const handleClear = () => {
    setTenureFileNumber('');
    setDtid('');
    setIsOpen(false);
    setDocumentPreviewResponse(null);
  };

  const [provisions, setProvisions] = useState<Provision[]>([
    { type: 'STANDARD LICENSE PROVISION 1', freeText: '', category: '', included: false, provision: 'Lorem ipsum...' },
    { type: 'STANDARD LICENSE PROVISION 2', freeText: '', category: '', included: false, provision: 'Lorem ipsum...' },
    { type: 'STANDARD LICENSE PROVISION 3', freeText: '', category: '', included: false, provision: 'Lorem ipsum...' },
  ]);

  const [documentType, setDocumentType] = useState('STANDARD_LICENSE');

  const handleCheckboxChange = (index: number) => {
    provisions[index].included = !provisions[index].included;
  };

  const fetchData = async () => {
    const nfrData = (await getDisplayData(parseInt(dtid))) as DocumentPreviewResponse;
    if (nfrData) {
      setDocumentPreviewResponse(nfrData);
      const dataProvisions = await getDocumentProvisionsByDocTypeIdDtid(1, 928437);
      const dataVariables = await getDocumentVariablesByDocTypeIdDtid(1, 928437);
      setIsOpen(true);
    }
  };

  const handleRetrieve = () => {
    if (tenureFileNumber !== '' && dtid !== '') {
      fetchData();
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapsible = () => setIsOpen(!isOpen);

  return (
    <div>
      <DocumentPreviewForm
        tenureFileNumber={tenureFileNumber}
        dtid={dtid}
        primaryContactName={documentPreviewResponse !== null ? documentPreviewResponse.primaryContactName : ''}
        onValidatedRetrieve={handleRetrieve}
        setTenureFileNumber={setTenureFileNumber}
        setDtid={setDtid}
        handleClear={handleClear}
      />

      <CustomCollapsible
        title="Disposition Transaction ID Details"
        isOpen={isOpen}
        toggleCollapsible={toggleCollapsible}
        isSpanRequired={false}
      >
        {documentPreviewResponse !== null ? (
          <ContactInfoDisplay
            contactName={documentPreviewResponse.contactName}
            organizationUnit={documentPreviewResponse.orgUnit}
            incorporationNumber={documentPreviewResponse.incorporationNum}
            emailAddress={documentPreviewResponse.contactEmail}
            dateInspected={documentPreviewResponse.inspectionDate}
          />
        ) : (
          ''
        )}
      </CustomCollapsible>

      <CustomCollapsible
        title="Tenure Details"
        isOpen={isOpen}
        toggleCollapsible={toggleCollapsible}
        isSpanRequired={false}
      >
        {documentPreviewResponse !== null ? (
          <LicenseDetailDisplay
            type={documentPreviewResponse.type}
            subtype={documentPreviewResponse.subType}
            purpose={documentPreviewResponse.purpose}
            subpurpose={documentPreviewResponse.subPurpose}
            locationOfLand={documentPreviewResponse.locLand}
            mailingAddress1={documentPreviewResponse.mailingAddress1}
            mailingAddress2={documentPreviewResponse.mailingAddress2}
            mailingAddress3={documentPreviewResponse.mailingAddress3}
          />
        ) : (
          ''
        )}
      </CustomCollapsible>

      <CustomCollapsible
        title="Interested Parties"
        isOpen={isOpen}
        toggleCollapsible={toggleCollapsible}
        isSpanRequired={false}
      >
        {documentPreviewResponse !== null ? (
          <InterestedPartiesDisplay interestedParties={documentPreviewResponse.interestedParties} />
        ) : (
          ''
        )}
      </CustomCollapsible>

      <div style={{ margin: '20px 0' }}>
        <h3 style={{ marginBottom: '10px' }}>Create Document</h3>
        <hr />
        <div>
          <label htmlFor="documentType" className="createDocument">
            Document Type :
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="select"
          >
            <option value="STANDARD_LICENSE">STANDARD LICENSE</option>
            <option value="Assignment Assumption">Assignment Assumption</option>
          </select>
        </div>
      </div>
      <CustomCollapsible title="Provisions" isOpen={isOpen} toggleCollapsible={toggleCollapsible} isSpanRequired={true}>
        <GroupSelectionAndProvisions
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          provisions={provisions}
          handleCheckboxChange={handleCheckboxChange}
        />
      </CustomCollapsible>

      <CustomCollapsible title="Variables" isOpen={isOpen} toggleCollapsible={toggleCollapsible} isSpanRequired={false}>
        <ProvisionsTable provisions={provisions} />
      </CustomCollapsible>

      <div className="button-container">
        <button className="button button--save" onClick={handleSaveForLater}>
          Save For Later
        </button>
        <button className="button button--generate" onClick={handleGenerateDocument}>
          Generate Document
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;
