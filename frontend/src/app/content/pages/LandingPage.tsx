import { FC, useCallback, useEffect, useState } from 'react';
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
  getGroupMaxByDocTypeId,
  getDocumentData,
} from '../../common/report';
import InterestedParties from '../display/InterestedParties';
import Skeleton from 'react-loading-skeleton';
import Provisions from '../display/Provisions';
import { ProvisionJson, SaveProvisionData } from '../../components/table/reports/SelectedProvisionsTable';
import VariablesTable, { SaveVariableData, VariableJson } from '../../components/table/reports/VariablesTable';
import { Alert, Button, Row } from 'react-bootstrap';
import { getActiveDocTypes } from '../../common/manage-doc-types';
import { getVariablesByDocType } from '../../common/manage-provisions';
import { useDispatch, useSelector } from 'react-redux';
import { setProvisionDataObjects, setSelectedProvisionIds } from '../../store/reducers/provisionSlice';
import { setSelectedVariableIds, setVariables } from '../../store/reducers/variableSlice';
import { RootState } from '../../store/store';
import { setSearchState } from '../../store/reducers/searchSlice';
import { useParams } from 'react-router-dom';

const LandingPage: FC = () => {
  const { dtidNumber, docTypeFromUrl } = useParams();
  const dtidFromUrl = dtidNumber ? parseInt(dtidNumber) : null;
  const [initializeDtid, setInitializeDtid] = useState<boolean>(true);
  const [initializeDocType, setInitializeDocType] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [showGenerateError, setShowGenerateError] = useState<boolean>(false);

  const [data, setData] = useState<DTRDisplayObject | null>(null);
  const [provisionGroups, setProvisionGroups] = useState<ProvisionGroup[]>([]);
  const [dtidInput, setDtidInput] = useState<number | null>();
  const [dtid, setDtid] = useState<number | null>(null);
  const [selectedDocTypeId, setSelectedDocTypeId] = useState<number | null>(null);
  const [documentType, setDocumentType] = useState<DocType | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocType[]>([]);
  const [filteredDocumentTypes, setFilteredDocumentTypes] = useState<DocType[]>([]);

  const [variableEdits, setVariableEdits] = useState<{ [variableId: number]: string }>({});

  const dispatch = useDispatch();
  const selectedProvisionIds: number[] = useSelector((state: RootState) => state.provision.selectedProvisionIds);
  const provisions = useSelector((state: RootState) => state.provision.provisions);
  const selectedVariableIds: number[] = useSelector((state: RootState) => state.variable.selectedVariableIds);
  const variables = useSelector((state: RootState) => state.variable.variables);
  const searchState = useSelector((state: RootState) => state.search);
  const [isOpen, setIsOpen] = useState(false);

  // Old route compatibility, set dtid from url, set doc type to lur if none given
  useEffect(() => {
    if (dtidFromUrl && initializeDtid) {
      setDtidInput(dtidFromUrl);
      setDtid(dtidFromUrl);
      fetchData(dtidFromUrl);
      setInitializeDtid(false);
    }
  }, [dtidFromUrl]);

  // Old route compatibility, set doc type from url
  useEffect(() => {
    if (docTypeFromUrl && initializeDocType && documentTypes.length > 0) {
      for (let dt of documentTypes) {
        if (dt.name.toLowerCase() === docTypeFromUrl.toLowerCase()) {
          setDocumentType(dt);
          setSelectedDocTypeId(dt.id);
          setInitializeDocType(false);
        }
      }
    } else if (!docTypeFromUrl && dtidFromUrl && initializeDocType && documentTypes.length > 0) {
      const lurDocType = documentTypes.find((dt) => dt.name === 'Land Use Report');
      if (lurDocType) {
        setDocumentType(lurDocType);
        setSelectedDocTypeId(lurDocType.id);
      }
      setInitializeDocType(false);
    }
  }, [documentTypes, docTypeFromUrl]);

  // Gets all document types and sorts them
  useEffect(() => {
    const fetchBasicData = async () => {
      try {
        const dts: DocType[] = await getActiveDocTypes();
        dts.sort((a, b) => a.name.localeCompare(b.name));
        setDocumentTypes(dts);
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

  // Used when coming from the search page to automatically load data
  useEffect(() => {
    const applySearch = async () => {
      if (searchState.searching && searchState.dtid && searchState.document_type) {
        dispatch(setSearchState({ searching: false }));
        setDtid(searchState.dtid);
        setDtidInput(searchState.dtid);
        setDocumentType(searchState.document_type);
        setSelectedDocTypeId(searchState.document_type.id);
        const displayData: { dtr: DTRDisplayObject | null; error: string | null } = await getDisplayData(
          searchState.dtid
        );
        if (!displayData.error) {
          setData(displayData.dtr);
        } else {
          setError(displayData.error);
          setShowError(true);
        }
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
          const defaultVariables: Variable[] = await getVariablesByDocType(documentType.id);
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
          // get provision groups and filter out the empty ones
          const provisionGroupsObject: ProvisionGroup[] = await getGroupMaxByDocTypeId(documentType.id);
          const activeProvisionGroups = provisionGroupsObject.filter((group) => activeProvisionIDs.has(group.id));
          setProvisionGroups(activeProvisionGroups);
        } catch (error) {
          console.error('Failed to fetch data', error);
          //setData(null);
        } finally {
          setLoading(false);
        }
      } else {
        // show an error
      }
    };
    fetchDocData();
  }, [documentType, dtid, dispatch]);

  useEffect(() => {
    if (data && data.type) {
      switch (data.type) {
        case 'LEASE':
          // filter out document type that includes word LICENCE
          setFilteredDocumentTypes(documentTypes.filter((dt) => !dt.name.toLowerCase().includes('licence')));
          break;
        case 'LICENCE':
          // filter out document type that includes word LEASE
          setFilteredDocumentTypes(documentTypes.filter((dt) => !dt.name.toLowerCase().includes('lease')));
          break;
        default:
          // if data.type is neither LEASE nor LICENCE, exclude document types with lease or licence in name
          setFilteredDocumentTypes(
            documentTypes.filter(
              (dt) => !dt.name.toLowerCase().includes('lease') && !dt.name.toLowerCase().includes('licence')
            )
          );
      }
    }
  }, [data, documentTypes]);

  const fetchData = async (dtidValue: number) => {
    try {
      setLoading(true);
      setDtid(dtidValue);
      // Fetch any existing documentData
      const displayData: { dtr: DTRDisplayObject | null; error: string | null } = await getDisplayData(dtidValue);
      if (!displayData.error) {
        setData(displayData.dtr);
      } else {
        setError(displayData.error);
        setShowError(true);
      }
    } catch (err: any) {
      setError(err);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataHandler = async () => {
    setError(null);
    setShowError(false);
    setData(null);
    setSelectedDocTypeId(null);
    // clear tables on search
    setDocumentType(null);
    setProvisionGroups([]);
    if (dtidInput) {
      fetchData(dtidInput);
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

  /**
   * Checks each provision group for mandatory provisions, then
   * checks that those provision groups have at least one provision
   * selected. If not, returns an error message.
   *
   * @returns the error message if any, otherwise null
   */
  const validateProvisions = (): string | null => {
    const mandatoryGroups: number[] = [];
    for (let p of provisions) {
      if (p.type === 'M' && !mandatoryGroups.includes(p.provision_group.provision_group)) {
        mandatoryGroups.push(p.provision_group.provision_group);
      }
    }
    const nonEmptyProvisionGroups: number[] = [];
    for (let p of provisions) {
      if (
        selectedProvisionIds.includes(p.provision_id) &&
        !nonEmptyProvisionGroups.includes(p.provision_group.provision_group)
      ) {
        nonEmptyProvisionGroups.push(p.provision_group.provision_group);
      }
    }
    const emptyMandatoryGroups = mandatoryGroups.filter((id) => !nonEmptyProvisionGroups.includes(id));
    emptyMandatoryGroups.sort((a, b) => a - b);
    if (emptyMandatoryGroups.length > 0) {
      return `There are unselected mandatory provisions the following groups: ${emptyMandatoryGroups.join(', ')}`;
    } else {
      return null;
    }
  };

  const handleVariableEdit = useCallback((variableId: number, newValue: string) => {
    setVariableEdits((prevEdits) => ({
      ...prevEdits,
      [variableId]: newValue,
    }));
  }, []);

  const getSaveData = () => {
    const selectedProvisions = provisions.filter((provision) => selectedProvisionIds.includes(provision.provision_id));
    const provisionSaveData: SaveProvisionData[] = selectedProvisions.map((provision) => {
      return {
        provision_id: provision.provision_id,
        doc_type_provision_id: provision.id,
      };
    });

    const selectedVariables: Variable[] = variables.filter((variable) => selectedVariableIds.includes(variable.id));
    const updatedVariables = selectedVariables.map((variable) => {
      if (variableEdits[variable.id] !== undefined) {
        return { ...variable, variable_value: variableEdits[variable.id] };
      }
      return variable;
    });
    dispatch(setVariables(updatedVariables));
    setVariableEdits({});
    const variableSaveData: SaveVariableData[] = updatedVariables.map((variable) => {
      return { variable_id: variable.id, variable_value: variable.variable_value, provision_id: variable.provision_id };
    });

    return { variableSaveData, provisionSaveData };
  };

  const handleClear = () => {
    setDtidInput(null);
    setData(null);
    setIsOpen(false);
    setSelectedDocTypeId(null);
    setShowError(false);
    setShowGenerateError(false);
  };

  const getReportData = () => {
    const selectedProvisions = provisions.filter((provision) => selectedProvisionIds.includes(provision.provision_id));
    const provisionJsonArray: ProvisionJson[] = selectedProvisions.map((provision) => {
      return {
        provision_id: provision.provision_id,
        provision_group: provision.provision_group.provision_group,
        sequence_value: provision.sequence_value,
        doc_type_provision_id: provision.id,
        provision_name: provision.provision_name,
        free_text: provision.free_text,
        list_items: provision.list_items,
      };
    });
    const selectedVariables: Variable[] = variables.filter((variable) => selectedVariableIds.includes(variable.id));
    const variableJsonArray: VariableJson[] = selectedVariables.map((variable) => {
      return { ...variable, variable_id: variable.id };
    });
    return { variableJsonArray, provisionJsonArray };
  };

  const handleDocumentSave = async () => {
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

  const handleGenerateReport = async () => {
    try {
      setShowGenerateError(false);
      setLoading(true);
      await handleDocumentSave();
      setLoading(true);
      if (dtid) {
        const errorMessage = validateProvisions();
        if (!errorMessage) {
          if (data && documentType && documentType.id) {
            const { variableJsonArray, provisionJsonArray } = getReportData();
            await generateReport(
              dtid,
              data && data.fileNum ? data.fileNum : '',
              documentType.id,
              provisionJsonArray,
              variableJsonArray
            );
          }
        } else {
          setGenerateError(errorMessage);
          setShowGenerateError(true);
        }
      }
    } catch (err) {
      console.log(err);
      setGenerateError('Something went wrong.');
      setShowGenerateError(true);
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
        <div className="inlineDiv">
          <b>DTID:</b>
        </div>
        <div className="inlineDiv ml-4 mr-4">
          <input
            type="number"
            className="form-control"
            id="dtid"
            value={dtidInput || ''}
            onChange={handleDtidChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                fetchDataHandler();
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }
            }}
          />
        </div>
        <Button variant="success" onClick={fetchDataHandler} style={{ marginRight: '10px', width: '150px' }}>
          Retrieve
        </Button>

        <Button
          variant="outline-primary"
          style={{ backgroundColor: 'transparent', color: 'black', width: '150px' }}
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
      {showError && (
        <Alert variant="danger" className="mb-3 d-inline-block" style={{ width: 'auto', maxWidth: '100%' }}>
          {error}
        </Alert>
      )}
      <div className="mb-3">
        <div className="inlineDiv mr-1">
          <b>Tenure File Number:</b>
        </div>
        <div className="inlineDiv" id="tfn">
          {data?.fileNum || <Skeleton />}
        </div>
      </div>
      <div className="mb-3">
        <div className="inlineDiv mr-1">
          <b>Primary Contact Name:</b>
        </div>
        <div className="inlineDiv">{data?.primaryContactName}</div>
      </div>
      <h3>Create Document</h3>
      <Row className="mb-3">
        <div className="ml-3">
          <b>Document Type:</b>
        </div>
      </Row>
      <Row className="mb-3">
        <div className="ml-3">
          <select
            className="form-control"
            value={selectedDocTypeId || ''}
            disabled={loading || !dtid || !data || showError}
            onChange={handleDocTypeChange}
          >
            <option value="-1">Select a document type</option>
            {filteredDocumentTypes.map((docType) => (
              <option key={docType.id} value={docType.id}>
                {docType.name}
              </option>
            ))}
          </select>
        </div>
      </Row>
      <Collapsible title="Disposition Transaction ID Details" isOpen={isOpen}>
        {data ? <DtidDetails data={data!} /> : <Skeleton />}
      </Collapsible>
      <Collapsible title="Tenure Details" isOpen={isOpen}>
        {data ? <TenureDetails data={data!} /> : <Skeleton />}
      </Collapsible>
      <Collapsible title="Interested Parties" isOpen={isOpen}>
        {data ? <InterestedParties data={data!} /> : <Skeleton />}
      </Collapsible>
      <Collapsible title="Provisions" isOpen={false} enabled={provisionGroups && dtid && documentType ? true : false}>
        {provisionGroups && dtid && documentType ? (
          <Provisions dtid={dtid} documentType={documentType} provisionGroups={provisionGroups} />
        ) : (
          <></>
        )}
      </Collapsible>
      <Collapsible title="Variables" isOpen={false} enabled={provisionGroups && dtid && documentType ? true : false}>
        {provisionGroups && dtid && documentType ? <VariablesTable onVariableEdit={handleVariableEdit} /> : <></>}
      </Collapsible>
      <>
        {' '}
        {showGenerateError && (
          <Alert variant="danger" className="mb-3 d-inline-block" style={{ width: 'auto', maxWidth: '100%' }}>
            {generateError}
          </Alert>
        )}
      </>
      <div style={{ display: 'flex', gap: '10px', minHeight: '55px' }}>
        <>
          <Button
            onClick={handleDocumentSave}
            style={{ margin: '5px' }}
            variant="success"
            disabled={loading || !data || !dtid || !documentType}
          >
            Save for later
          </Button>
          <Button
            onClick={handleGenerateReport}
            style={{ margin: '5px' }}
            disabled={loading || !data || !dtid || !documentType}
          >
            Create
          </Button>
        </>
      </div>
    </>
  );
};

export default LandingPage;
