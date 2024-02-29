import { FC, useCallback, useEffect, useState } from 'react';
import Collapsible from '../../../app/components/common/Collapsible';
import { DTRDisplayObject } from '../../../app/types/types';
import TenureDetails from '../display/TenureDetails';
import Button from '../../../app/components/common/Button';
import AreaDetails from '../display/AreaDetails';
import DtidDetails from '../display/DtidDetails';
import {
  generateNfrReport,
  generateReport,
  getData,
  getMandatoryProvisionsByVariant,
  getNfrProvisionsByVariantDtid,
  saveNfr,
} from '../../common/report';
import VariantDropdown from '../../components/common/VariantDropdown';
import { CURRENT_REPORT_PAGES, NFR_REPORT_PAGES, NFR_VARIANTS } from '../../util/constants';
import InterestedParties from '../display/InterestedParties';
import { useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import Provisions, { ProvisionData } from '../display/Provisions';
import Variables from '../display/Variables';
import { ProvisionJson, SaveProvisionData } from '../../components/table/SelectedProvisionsTable';
import { SaveVariableData, VariableJson } from '../../components/table/VariablesTable';

export interface ReportPageProps {
  documentDescription: string;
}

const ReportPage: FC<ReportPageProps> = ({ documentDescription }) => {
  const { dtid } = useParams<{ dtid: string }>();
  const dtidNumber = dtid ? parseInt(dtid, 10) : null;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DTRDisplayObject | null>(null);
  const [showNfr, setShowNfr] = useState<boolean>(false);
  const [allProvisions, setAllProvisions] = useState<ProvisionData[]>([]);
  const [variableArray, setVariableArray] = useState<SaveVariableData[]>([]);
  const [provisionArray, setProvisionArray] = useState<SaveProvisionData[]>([]);
  const [variableJsonArray, setVariableJsonArray] = useState<VariableJson[]>([]);
  const [provisionJsonArray, setProvisionJsonArray] = useState<ProvisionJson[]>([]);
  const [selectedProvisionIds, setSelectedProvisionIds] = useState<number[]>([]);
  const [mandatoryProvisionIds, setMandatoryProvisionIds] = useState<number[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    setShowNfr(NFR_VARIANTS.includes(documentDescription.toUpperCase()));
    const fetchData = async () => {
      if (dtidNumber) {
        try {
          setLoading(true);
          const fetchedData: DTRDisplayObject = await getData(dtidNumber);
          setData(fetchedData);
          const fetchProvisions: ProvisionData[] = await getNfrProvisionsByVariantDtid(documentDescription, dtidNumber);
          setAllProvisions(fetchProvisions);
          const mpIds: number[] = await getMandatoryProvisionsByVariant(documentDescription);
          setMandatoryProvisionIds(mpIds);
        } catch (error) {
          console.error('Failed to fetch data', error);
          setData(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [dtidNumber, documentDescription]);

  const generateReportHandler = () => {
    if (dtidNumber) {
      generateReport(dtidNumber, data!.fileNum, documentDescription);
    }
  };

  const handleNfrGenerate = () => {
    if (dtidNumber) {
      const errorMessage = validateProvisions();
      if (!errorMessage) {
        if (data) {
          generateNfrReport(
            dtidNumber,
            data.fileNum,
            documentDescription.toUpperCase(),
            provisionJsonArray,
            variableJsonArray
          );
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

  const variantChangeHandler = (variant: string) => {
    const upperCaseVariant = variant.toUpperCase();
    navigate(`/dtid/${dtid}/${upperCaseVariant}`);
  };

  const updateSelectedProvisionIds = useCallback((selectedProvisionIds: number[]) => {
    setSelectedProvisionIds(selectedProvisionIds);
  }, []);

  const updateVariableArray = useCallback((variableJsonData: VariableJson[]) => {
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

  const handleNfrSave = () => {
    const saveData = async () => {
      if (dtidNumber) {
        try {
          setLoading(true);
          await saveNfr(dtidNumber, documentDescription.toUpperCase(), provisionArray, variableArray);
        } catch (err) {
          console.log('Error saving NFR Data');
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

  return (
    <>
      <div className="h1">Preview - {documentDescription} (Draft)</div>
      <hr />
      {Object.values(NFR_REPORT_PAGES).includes(documentDescription) && (
        <div>
          <VariantDropdown
            values={NFR_REPORT_PAGES}
            selectedVariant={documentDescription}
            variantChangeHandler={variantChangeHandler}
          />
          <hr />
        </div>
      )}
      <div className="mb-3 mt-3">
        <div className="font-weight-bold inlineDiv mr-1">DTID:</div>
        <div className="inlineDiv" id="dtid">
          {data?.dtid || <Skeleton />}
        </div>
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
      {documentDescription === CURRENT_REPORT_PAGES.LUR ? (
        <Collapsible title="Area">{data ? <AreaDetails data={data!} /> : <Skeleton />}</Collapsible>
      ) : (
        <Collapsible title="Interested Parties">{data ? <InterestedParties data={data!} /> : <Skeleton />}</Collapsible>
      )}
      {showNfr && (
        <Collapsible title="Provisions">
          <Provisions
            dtid={dtidNumber!}
            variantName={documentDescription}
            updateHandler={updateProvisionArray}
            updateSelectedProvisionIds={updateSelectedProvisionIds}
          />
        </Collapsible>
      )}
      {showNfr && (
        <Collapsible title="Variables">
          <Variables
            dtid={dtidNumber!}
            variantName={documentDescription}
            updateHandler={updateVariableArray}
            selectedProvisionIds={selectedProvisionIds}
          />
        </Collapsible>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        {showNfr ? (
          <>
            <Button text="Save for later" onClick={handleNfrSave} type={'btn-success'} disabled={loading} />
            <Button text="Create" onClick={handleNfrGenerate} disabled={loading} />
          </>
        ) : (
          <Button text="Create" onClick={generateReportHandler} disabled={loading} />
        )}
      </div>
    </>
  );
};

export default ReportPage;
