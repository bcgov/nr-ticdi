import { FC, useCallback, useEffect, useState } from 'react';
import Collapsible from '../../../app/components/common/Collapsible';
import {
  DTRDisplayObject,
  DocType,
  DocumentDataDTO,
  ProvisionDataObject,
  ProvisionGroup,
} from '../../../app/types/types';
import TenureDetails from '../display/TenureDetails';
import DtidDetails from '../display/DtidDetails';
import {
  generateReport,
  getDisplayData,
  saveDocument,
  getMandatoryProvisionsByDocTypeId,
  getGroupMaxByDocTypeId,
  getDocumentData,
  getAllProvisionGroups,
} from '../../common/report';
import InterestedParties from '../display/InterestedParties';
import Skeleton from 'react-loading-skeleton';
import Provisions from '../display/Provisions';
import Variables from '../display/Variables';
import { ProvisionJson, SaveProvisionData } from '../../components/table/reports/SelectedProvisionsTable';
import { SaveVariableData, VariableJson } from '../../components/table/reports/VariablesTable';
import { Button, Row } from 'react-bootstrap';
import { getDocumentTypes } from '../../common/manage-doc-types';

const LandingPage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DTRDisplayObject | null>(null);
  const [allProvisions, setAllProvisions] = useState<ProvisionDataObject[]>([]);
  // const [allVariables, setAllVariables] = useState<ProvisionVariable[]>([]);
  const [variableArray, setVariableArray] = useState<SaveVariableData[]>([]);
  const [provisionArray, setProvisionArray] = useState<SaveProvisionData[]>([]);
  const [variableJsonArray, setVariableJsonArray] = useState<VariableJson[]>([]);
  const [provisionJsonArray, setProvisionJsonArray] = useState<ProvisionJson[]>([]);
  const [selectedProvisionIds, setSelectedProvisionIds] = useState<number[]>([]);
  const [mandatoryProvisionIds, setMandatoryProvisionIds] = useState<number[]>([]);

  const [allProvisionGroups, setAllProvisionGroups] = useState<ProvisionGroup[]>([]);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);

  const [dtid, setDtid] = useState<number>();
  const [selectedDocTypeId, setSelectedDocTypeId] = useState<number | null>(null);
  const [documentType, setDocumentType] = useState<DocType | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocType[]>([]);

  useEffect(() => {
    const fetchBasicData = async () => {
      try {
        const documentTypes: DocType[] = await getDocumentTypes();
        documentTypes.sort((a, b) => a.name.localeCompare(b.name));
        setDocumentTypes(documentTypes);
        const pgs: ProvisionGroup[] = await getAllProvisionGroups();
        console.log(pgs);
        // pgs.sort((a, b) => a.provision_group - b.provision_group);
        setAllProvisionGroups(pgs);
      } catch (error) {
        console.error('Failed to fetch doc types', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    console.log('fetching doc types');
    fetchBasicData();
  }, []);

  useEffect(() => {
    if (documentTypes && selectedDocTypeId) {
      setDocumentType(documentTypes.find((docType) => docType.id === selectedDocTypeId) || null);
    }
  }, [documentTypes, selectedDocTypeId]);

  const fetchDataHandler = async () => {
    if (dtid) {
      try {
        setLoading(true);
        // Fetch any existing documentData
        const displayData: DTRDisplayObject = await getDisplayData(dtid);
        setData(displayData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchDocData = async () => {
      if (dtid && documentType && documentType.id) {
        try {
          setLoading(true);
          // provisions, will be validated against
          const documentData: DocumentDataDTO = await getDocumentData(documentType.id, dtid);
          console.log('documentData');
          console.log(documentData);
          // const fetchProvisions: { provisions: ProvisionData[]; provisionIds: number[] } =
          //   await getDocumentProvisionsByDocTypeIdDtid(documentType.id, dtid);
          setAllProvisions(documentData.provisions);
          const activeProvisionIDs = new Set(
            documentData.provisions
              .filter((provision) => provision.active_flag && !provision.is_deleted && provision.provision_group)
              .map((provision) => provision.provision_group.id)
          );
          // mandatory provisions, will be validated against
          const mpIds: number[] = await getMandatoryProvisionsByDocTypeId(documentType.id);
          setMandatoryProvisionIds(mpIds);
          // get provision groups and filter out the empty ones
          const provisionGroupsObject: ProvisionGroup[] = await getGroupMaxByDocTypeId(documentType.id);
          const activeProvisionGroups = provisionGroupsObject.filter((group) => activeProvisionIDs.has(group.id));
          setProvisionGroups(activeProvisionGroups);
        } catch (error) {
          console.error('Failed to fetch data', error);
          setData(null);
        } finally {
          setLoading(false);
        }
      } else {
        // show an error
      }
    };
    fetchDocData();
  }, [documentType, dtid]);

  const handleGenerateReport = () => {
    if (dtid) {
      const errorMessage = validateProvisions();
      if (!errorMessage) {
        if (data && documentType && documentType.id) {
          generateReport(dtid, data!.fileNum, documentType.id, provisionJsonArray, variableJsonArray);
        }
      } else {
        alert(errorMessage);
      }
    }
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

  const updateSelectedProvisionIds = useCallback((selectedProvisionIds: number[]) => {
    console.log('updating selectedProvisionIds');
    console.log(selectedProvisionIds);
    setSelectedProvisionIds((prevIds) => selectedProvisionIds);
  }, []);

  const updateVariableArray = useCallback((variableJsonData: VariableJson[]) => {
    console.log('updating variableJsonData');
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

  const handleDocumentSave = () => {
    console.log('saving...');
    console.log('variableArray');
    console.log(variableArray);
    const saveData = async () => {
      if (dtid && documentType) {
        try {
          setLoading(true);
          await saveDocument(dtid, documentType.id, provisionArray, variableArray);
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

  const handleDocTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedDocTypeId(selectedId || null);
  };

  const handleDtidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDtid(Number(e.target.value));
  };

  return (
    <>
      <div className="h1">{documentType ? `Preview - ${documentType.name}` : 'Document Preview'}</div>
      <hr />
      <div className="mb-3 mt-3">
        <div className="font-weight-bold inlineDiv mr-1">DTID:</div>
        <div className="inlineDiv ml-3">
          <input type="number" className="form-control" id="dtid" value={dtid || ''} onChange={handleDtidChange} />
        </div>
        <Button variant="success" onClick={fetchDataHandler}>
          Retrieve
        </Button>
      </div>
      <div className="mb-3">
        <div className="font-weight-bold inlineDiv mr-1">Tenure File Number:</div>
        <div className="inlineDiv" id="tfn">
          {data?.fileNum || <Skeleton />}
        </div>
      </div>
      <div className="mb-3">
        <div className="font-weight-bold inlineDiv mr-1">Primary Contact Name:</div>
        <div className="inlineDiv">{data?.primaryContactName}</div>
      </div>
      <Collapsible title="Disposition Transaction ID Details">
        {data ? <DtidDetails data={data!} /> : <Skeleton />}
      </Collapsible>
      <Collapsible title="Tenure Details">{data ? <TenureDetails data={data!} /> : <Skeleton />}</Collapsible>
      <Collapsible title="Interested Parties">{data ? <InterestedParties data={data!} /> : <Skeleton />}</Collapsible>
      <hr />
      <h3>Create Document</h3>
      <hr />
      <Row className="mb-3">
        <div className="mr-3">Document Type:</div>
        <div>
          <select value={selectedDocTypeId || ''} onChange={handleDocTypeChange}>
            <option value="-1">Select a document type</option>
            {documentTypes.map((docType) => (
              <option key={docType.id} value={docType.id}>
                {docType.name}
              </option>
            ))}
          </select>
        </div>
      </Row>
      {provisionGroups && dtid && documentType && (
        <>
          <Collapsible title="Provisions">
            <Provisions
              dtid={dtid}
              documentType={documentType}
              provisionGroups={provisionGroups}
              provisions={allProvisions}
              updateHandler={updateProvisionArray}
              updateSelectedProvisionIds={updateSelectedProvisionIds}
            />
          </Collapsible>

          <Collapsible title="Variables">
            <Variables
              dtid={dtid}
              documentType={documentType}
              updateHandler={updateVariableArray}
              selectedProvisionIds={selectedProvisionIds}
            />
          </Collapsible>
        </>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <>
          <Button onClick={handleDocumentSave} variant="success" disabled={loading}>
            Save for later
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            Create
          </Button>
        </>
      </div>
    </>
  );
};

export default LandingPage;
