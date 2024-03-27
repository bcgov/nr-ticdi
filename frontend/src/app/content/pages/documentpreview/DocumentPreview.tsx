import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  generateReport,
  getDisplayData,
  getDocumentProvisionsByDocTypeIdDtid,
  getDocumentTypes,
  getDocumentVariablesByDocTypeIdDtid,
  getGroupMaxByDocTypeId,
  getMandatoryProvisionsByDocTypeId,
  saveDocument,
} from '../../../common/report';
import './DocumentPreview.scss';
import { DTRDisplayObject, DocType, ProvisionGroup } from '../../../types/types';
import Skeleton from 'react-loading-skeleton';
import { Button } from 'react-bootstrap';
import CustomCollapsible from './CustomCollapsible';
import DtidDetails from '../../display/DtidDetails';
import TenureDetails from '../../display/TenureDetails';
import InterestedParties from '../../display/InterestedParties';
import Provisions, { ProvisionData } from '../../display/Provisions';
import { ProvisionJson, SaveProvisionData } from '../../../components/table/reports/SelectedProvisionsTable';
import Variables from '../../display/Variables';
import { SaveVariableData, VariableJson } from '../../../components/table/reports/VariablesTable';



const DocumentPreview: React.FC = () => {
  const [data, setData] = useState<DTRDisplayObject | null>(null);
  const [tenureFileNumber, setTenureFileNumber] = useState('');
  const [dtid, setDtid] = useState(''); //928437
  const [isOpen, setIsOpen] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocType[]>([]);
  const [documentType, setDocumentType] = useState<DocType>();
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [mandatoryProvisionIds, setMandatoryProvisionIds] = useState<number[]>([]);
  const [selectedProvisionIds, setSelectedProvisionIds] = useState<number[]>([]);
  const [provisionArray, setProvisionArray] = useState<SaveProvisionData[]>([]);
  const [provisionJsonArray, setProvisionJsonArray] = useState<ProvisionJson[]>([]);
  const [variableArray, setVariableArray] = useState<SaveVariableData[]>([]);
  const [variableJsonArray, setVariableJsonArray] = useState<VariableJson[]>([]);
  const [dtidNumber, setdtidNumber] = useState<number>(-1);

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    tenureFileNumber: '',
    dtid: '',
  });
  let newErrors = { tenureFileNumber: '', dtid: '' };



  useEffect(() => {
    const fetchData = async () => {
      if (dtidNumber === -1) return;
      try {
        setLoading(true);
        // Fetch any existing documentData
        const displayData: DTRDisplayObject = await getDisplayData(dtidNumber);
        if (!displayData) {
          newErrors.dtid = 'Data not found.';
          setErrors(newErrors);
          return;
        }
        setData(displayData);
        if (!documentType) return;
        // provisions, will be validated against
        const fetchProvisions: { provisions: ProvisionData[]; provisionIds: number[] } =
          await getDocumentProvisionsByDocTypeIdDtid(documentType.id, dtidNumber);
        setAllProvisions(fetchProvisions.provisions);
        const activeProvisionIDs = new Set(
          fetchProvisions.provisions
            .filter((provision) => provision.active_flag && !provision.is_deleted)
            .map((provision) => provision.provision_group.id)
        );
        // mandatory provisions, will be validated against
        const mpIds: number[] = await getMandatoryProvisionsByDocTypeId(documentType.id);
        setMandatoryProvisionIds(mpIds);
        // get provision groups and filter out the empty ones
        const provisionGroupsObject: ProvisionGroup[] = await getGroupMaxByDocTypeId(documentType.id);
        const activeProvisionGroups = provisionGroupsObject.filter((group) => activeProvisionIDs.has(group.id));
        setProvisionGroups(activeProvisionGroups);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setData(null);
        newErrors.dtid = 'Data not found.';
        setErrors(newErrors);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dtidNumber, documentType]);

  const toggleCollapsible = () => setIsOpen(!isOpen);

  const validateFields = (): boolean => {
    newErrors.dtid = '';
    if (!dtid) {
      newErrors.dtid = 'DTID is required.';
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRetrieveClick = () => {
    if (validateFields())
      setdtidNumber(parseInt(dtid, 10))
  };
  const handleClear = () => {
    setTenureFileNumber('');
    setDtid('');
    setData(null);
    setIsOpen(false);
    newErrors.dtid = '';
    setErrors(newErrors);
    setdtidNumber(-1)
  };

  useEffect(() => {
    const getDocTypes = async () => {
      const docTypes = await getDocumentTypes();
      setDocumentTypes(docTypes || []);
      setDocumentType(docTypes[0] || [])
    };
    getDocTypes();
  }, []);

  const updateProvisionArray = useCallback((provisionJsonData: ProvisionJson[]) => {
    // used for saving
    setProvisionArray(
      provisionJsonData.map((provision) => {
        return { provision_id: provision.provision_id, free_text: provision.free_text };
      })
    );
    // used to generate document
    setProvisionJsonArray(provisionJsonData);
  }, []);

  const updateSelectedProvisionIds = useCallback((selectedProvisionIds: number[]) => {
    setSelectedProvisionIds(selectedProvisionIds);
  }, []);

  const updateVariableArray = useCallback((variableJsonData: VariableJson[]) => {
    console.log('variableJsonData');
    console.log(variableJsonData);
    // used for saving
    setVariableArray(
      variableJsonData.map((variable) => {
        return {
          provision_id: variable.provision_id,
          variable_id: variable.variable_id,
          variable_value: variable.variable_value,
        };
      })
    );
    // used to generate document
    setVariableJsonArray(variableJsonData);
  }, []);

  const handleDocumentSave = () => {
    console.log('saving...');
    console.log('variableArray');
    console.log(variableArray);
    const saveData = async () => {
      if (dtidNumber && documentType) {
        try {
          setLoading(true);
          await saveDocument(dtidNumber, documentType.id, provisionArray, variableArray);
        } catch (err) {
          console.log('Error saving Document Data');
          console.log(err);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No DTID was found.');
      }
    };
    saveData();
  };

  const validateProvisions = (): string | null => {
    const unselectedMandatoryIds = mandatoryProvisionIds.filter(
      (mandatoryId) => !selectedProvisionIds.includes(mandatoryId)
    );
    const matchingProvisions = allProvisions.filter((provision) => unselectedMandatoryIds.includes(provision.id));
    const matchingGroupNumbers = [...new Set(matchingProvisions.map((provision) => provision.provision_group))];
    if (matchingGroupNumbers.length > 0) {
      return `There are unselected mandatory provisions the following groups: ${matchingGroupNumbers.join(', ')}`;
    } else {
      return null;
    }
  };

  const handleGenerateReport = () => {
    if (dtidNumber && documentType) {
      const errorMessage = validateProvisions();
      if (!errorMessage) {
        if (data) {
          generateReport(dtidNumber, data!.fileNum, documentType.id, provisionJsonArray, variableJsonArray);
        }
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(documentTypes.find(i => i.id == parseInt(e.target.value)))
  };

  return (
    <div className="document-preview">
      <div className="h1">Document Preview</div>
      <hr className="document-preview__divider" />
      <div className="mb-3 mt-3 d-flex">
        <div className="font-weight-bold mr-5">Tenure File Number:</div>
        <div className="mr-6">
          {/* {data?.dtid || <Skeleton />} */}
          <input
            id="tenureFileNumber"
            type="text"
            className="form-control"
            value={data ? data.fileNum : ''}
            onChange={(e) => setTenureFileNumber(e.target.value)}
          />
        </div>
        <div className="mr-3 ml-5">
          <Button variant="success" onClick={handleRetrieveClick}>Retrieve</Button>
        </div>
        <div>
          <Button variant="outline-primary" style={{ backgroundColor: 'transparent', color: 'black' }} onClick={handleClear}>Clear</Button>
        </div>
      </div>
      <div className="mb-3 d-flex">
        <div className="font-weight-bold inlineDiv mr-5">DTID:</div>
        <div className="inlineDiv dtid-text" id="tfn">
          {/* {data?.fileNum || <Skeleton />} */}
          <input
            id="dtid"
            type="number"
            className="form-control"
            value={dtid}
            onChange={(e) => setDtid(e.target.value)}

          />
          {errors.dtid && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.dtid}</div>}
        </div>
      </div>
      <div className="mb-3">
        <div className="font-weight-bold inlineDiv mr-1">Primary Contact Name:</div>
        <div className="inlineDiv">{data?.primaryContactName}</div>
      </div>
      <CustomCollapsible
        title="Disposition Transaction ID Details"
        isOpen={isOpen}
        toggleCollapsible={toggleCollapsible}
        isSpanRequired={false}
      >
        {data ? <DtidDetails data={data!} /> : <Skeleton />}
      </CustomCollapsible>
      <CustomCollapsible
        title="Tenure Details"
        isOpen={isOpen}
        toggleCollapsible={toggleCollapsible}
        isSpanRequired={false}
      >
        {data ? <TenureDetails data={data!} /> : <Skeleton />}
      </CustomCollapsible>
      <CustomCollapsible
        title="Interested Parties"
        isOpen={isOpen}
        toggleCollapsible={toggleCollapsible}
        isSpanRequired={false}
      >
        {data ? <InterestedParties data={data!} /> : <Skeleton />}
      </CustomCollapsible>

      <div style={{ margin: '20px 0' }}>
        <h3 style={{ marginBottom: '10px' }}>Create Document</h3>
        <hr />
        <div className='d-flex'>
          <label htmlFor="documentType" className="createDocument">
            Document Type :
          </label>
          <select
            id="documentType"

            onChange={handleDocumentTypeChange}
            className="select"
          >
            {documentTypes.map((docType) => (
              <option key={docType.id} value={docType.id}>{docType.name}</option>
            ))}
          </select>
        </div>
      </div>
      <CustomCollapsible title="Provisions" isOpen={isOpen} toggleCollapsible={toggleCollapsible} isSpanRequired={true}>
        {(dtidNumber && documentType) ? <Provisions
          dtid={dtidNumber!}
          documentType={documentType}
          provisionGroups={provisionGroups}
          updateHandler={updateProvisionArray}
          updateSelectedProvisionIds={updateSelectedProvisionIds} /> : <Skeleton />}
      </CustomCollapsible>
      <CustomCollapsible title="Variables" isOpen={isOpen} toggleCollapsible={toggleCollapsible} isSpanRequired={false}>
        {(dtidNumber && documentType) ? <Variables
          dtid={dtidNumber!}
          documentType={documentType}
          updateHandler={updateVariableArray}
          selectedProvisionIds={selectedProvisionIds}
        /> : <Skeleton />}
      </CustomCollapsible>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <>
          <Button onClick={handleDocumentSave} variant="success" disabled={loading}>
            Save for later
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            Create
          </Button>
        </>
      </div>
    </div>
  );
};

export default DocumentPreview;
