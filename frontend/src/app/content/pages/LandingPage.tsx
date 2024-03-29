import { FC, useEffect, useState } from 'react';
import Collapsible from '../../../app/components/common/Collapsible';
import {
  DTRDisplayObject,
  DocType,
  DocumentDataDTO,
  ProvisionGroup,
  SavedVariableInfo,
  Variable,
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
} from '../../common/report';
import InterestedParties from '../display/InterestedParties';
import Skeleton from 'react-loading-skeleton';
import Provisions from '../display/Provisions';
import { ProvisionJson, SaveProvisionData } from '../../components/table/reports/SelectedProvisionsTable';
import VariablesTable, { SaveVariableData, VariableJson } from '../../components/table/reports/VariablesTable';
import { Button, Row } from 'react-bootstrap';
import { getDocumentTypes } from '../../common/manage-doc-types';
import { getVariables } from '../../common/manage-provisions';
import { useDispatch, useSelector } from 'react-redux';
import { setProvisionDataObjects, setSelectedProvisionIds } from '../../store/reducers/provisionSlice';
import { setSelectedVariableIds, setVariables } from '../../store/reducers/variableSlice';
import { RootState } from '../../store/store';
import { setSearchState } from '../../store/reducers/searchSlice';

const LandingPage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DTRDisplayObject | null>(null);
  const [mandatoryProvisionIds, setMandatoryProvisionIds] = useState<number[]>([]);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);
  const [dtidInput, setDtidInput] = useState<number | null>();
  const [dtid, setDtid] = useState<number | null>(null);
  const [selectedDocTypeId, setSelectedDocTypeId] = useState<number | null>(null);
  const [documentType, setDocumentType] = useState<DocType | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocType[]>([]);

  const dispatch = useDispatch();
  const selectedProvisionIds: number[] = useSelector((state: RootState) => state.provision.selectedProvisionIds);
  const provisions = useSelector((state: RootState) => state.provision.provisions);
  const selectedVariableIds: number[] = useSelector((state: RootState) => state.variable.selectedVariableIds);
  const variables = useSelector((state: RootState) => state.variable.variables);
  const searchState = useSelector((state: RootState) => state.search);

  useEffect(() => {
    const fetchBasicData = async () => {
      try {
        const documentTypes: DocType[] = await getDocumentTypes();
        documentTypes.sort((a, b) => a.name.localeCompare(b.name));
        setDocumentTypes(documentTypes);
      } catch (error) {
        console.error('Failed to fetch doc types', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBasicData();
  }, []);

  useEffect(() => {
    if (documentTypes && selectedDocTypeId) {
      setDocumentType(documentTypes.find((docType) => docType.id === selectedDocTypeId) || null);
    }
  }, [documentTypes, selectedDocTypeId]);

  useEffect(() => {
    const applySearch = async () => {
      if (searchState.searching && searchState.dtid && searchState.document_type) {
        dispatch(setSearchState({ searching: false }));
        setDtid(searchState.dtid);
        setDtidInput(searchState.dtid);
        setDocumentType(searchState.document_type);
        setSelectedDocTypeId(searchState.document_type.id);
        const displayData: DTRDisplayObject = await getDisplayData(searchState.dtid);
        setData(displayData);
      }
    };
    applySearch();
  }, [searchState, dispatch]);

  useEffect(() => {
    const fetchDocData = async () => {
      if (dtid && documentType && documentType.id) {
        try {
          setLoading(true);
          // provisions, will be validated against
          const documentData: DocumentDataDTO = await getDocumentData(documentType.id, dtid);
          dispatch(setProvisionDataObjects(documentData?.provisions));
          dispatch(setSelectedProvisionIds(documentData?.preselectedProvisionIds));
          const defaultVariables: Variable[] = await getVariables();
          const savedVariableInfo: SavedVariableInfo[] = documentData.savedVariableInfo;
          const variables: Variable[] = defaultVariables.map((defaultVar) => {
            const savedVar = savedVariableInfo.find((info) => info.variable_id === defaultVar.id);
            return {
              ...defaultVar,
              variable_value: savedVar?.saved_value || defaultVar.variable_value,
            };
          });
          dispatch(setVariables(variables));
          const selectedVariables = variables
            .filter((v) => documentData?.preselectedProvisionIds?.includes(v.provision_id))
            .map((v) => v.id);
          dispatch(setSelectedVariableIds(selectedVariables));
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
  }, [documentType, dtid, dispatch]);

  const fetchDataHandler = async () => {
    if (dtidInput) {
      try {
        setLoading(true);
        setDtid(dtidInput);
        // Fetch any existing documentData
        const displayData: DTRDisplayObject = await getDisplayData(dtidInput);
        setData(displayData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      setData(null);
      setDtid(null);
    }
  };

  const handleDocTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedDocTypeId(selectedId || null);
  };

  const handleDtidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDtidInput(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : null);
  };

  const validateProvisions = (): string | null => {
    const unselectedMandatoryIds = mandatoryProvisionIds.filter(
      (mandatoryId) => !selectedProvisionIds.includes(mandatoryId)
    );
    const matchingProvisionIds = selectedProvisionIds.filter((id) => unselectedMandatoryIds.includes(id));
    const matchingProvisions = provisions.filter((p) => matchingProvisionIds.includes(p.id));
    const matchingGroupNumbers = [...new Set(matchingProvisions.map((provision) => provision.provision_group))];
    if (matchingGroupNumbers.length > 0) {
      return `There are unselected mandatory provisions the following groups: ${matchingGroupNumbers.join(', ')}`;
    } else {
      return null;
    }
  };

  const getSaveData = () => {
    const selectedProvisions = provisions.filter((provision) => selectedProvisionIds.includes(provision.provision_id));
    const provisionSaveData: SaveProvisionData[] = selectedProvisions.map((provision) => {
      return {
        provision_id: provision.provision_id,
        doc_type_provision_id: provision.id,
      };
    });
    const selectedVariables: Variable[] = variables.filter((variable) => selectedVariableIds.includes(variable.id));
    const variableSaveData: SaveVariableData[] = selectedVariables.map((variable) => {
      return { variable_id: variable.id, variable_value: variable.variable_value, provision_id: variable.provision_id };
    });
    return { variableSaveData, provisionSaveData };
  };

  const getReportData = () => {
    const selectedProvisions = provisions.filter((provision) => selectedProvisionIds.includes(provision.provision_id));
    const provisionJsonArray: ProvisionJson[] = selectedProvisions.map((provision) => {
      return {
        provision_id: provision.provision_id,
        provision_group: provision.provision_group.provision_group,
        doc_type_provision_id: provision.id,
        provision_name: provision.provision_name,
        free_text: provision.free_text,
      };
    });
    const selectedVariables: Variable[] = variables.filter((variable) => selectedVariableIds.includes(variable.id));
    const variableJsonArray: VariableJson[] = selectedVariables.map((variable) => {
      return { ...variable, variable_id: variable.id };
    });
    return { variableJsonArray, provisionJsonArray };
  };

  const handleDocumentSave = () => {
    console.log('saving...');
    const saveData = async () => {
      if (dtid && documentType) {
        try {
          setLoading(true);
          const { variableSaveData, provisionSaveData } = getSaveData();
          await saveDocument(dtid, documentType.id, provisionSaveData, variableSaveData);
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

  const handleGenerateReport = () => {
    try {
      setLoading(true);
      if (dtid) {
        const errorMessage = validateProvisions();
        if (!errorMessage) {
          if (data && documentType && documentType.id) {
            const { variableJsonArray, provisionJsonArray } = getReportData();
            generateReport(dtid, data!.fileNum, documentType.id, provisionJsonArray, variableJsonArray);
          }
        } else {
          alert(errorMessage);
        }
      }
    } catch (err) {
      console.log(err);
      // set error state
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h1">{documentType ? `Preview - ${documentType.name}` : 'Document Preview'}</div>
      <hr />
      <div className="mb-3 mt-3">
        <div className="font-weight-bold inlineDiv">DTID:</div>
        <div className="inlineDiv ml-4 mr-4">
          <input type="number" className="form-control" id="dtid" value={dtidInput || ''} onChange={handleDtidChange} />
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
        <div className="ml-3 mr-3">
          <b>Document Type:</b>
        </div>
        <div>
          <select value={selectedDocTypeId || ''} disabled={loading || !dtid || !data} onChange={handleDocTypeChange}>
            <option value="-1">Select a document type</option>
            {documentTypes.map((docType) => (
              <option key={docType.id} value={docType.id}>
                {docType.name}
              </option>
            ))}
          </select>
        </div>
      </Row>
      {provisionGroups && dtid && documentType ? (
        <>
          <Collapsible title="Provisions">
            <Provisions dtid={dtid} documentType={documentType} provisionGroups={provisionGroups} />
          </Collapsible>

          <Collapsible title="Variables">
            <VariablesTable />
          </Collapsible>
        </>
      ) : (
        <></>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <>
          <Button onClick={handleDocumentSave} variant="success" disabled={loading || !data || !dtid || !documentType}>
            Save for later
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading || !data || !dtid || !documentType}>
            Create
          </Button>
        </>
      </div>
    </>
  );
};

export default LandingPage;
